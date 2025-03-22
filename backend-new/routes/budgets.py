from flask import Blueprint, request, jsonify, current_app
from database import get_db
from datetime import datetime
import jwt

budgets_bp = Blueprint('budgets', __name__)

# Validates date and converts to datetime object
def validate_dates(date_str):
    try: 
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return None
    
# Validates amount to ensure its postiive  
def validate_amount(amount_str):
    try: 
        amount = float(amount_str)
        if amount <= 0:
            return None
        
        return amount
    except ValueError:
        return None

# Create a new budget
@budgets_bp.route('/create', methods=['POST'])
def create_budget():
    try: 
        # Authorization header extraction from request
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({"error": "Missing authorization token."}), 403
        
        # Extract token from auth header
        token = auth_header.split(" ")[1]

        try:
            # Use secret key to decode token and retrieve user id
            decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401
        
        # Retrieve data from request body
        data = request.get_json()

        # Debug data log
        print(f"Received budget data: {data}")
        
        # Store data into required fields
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        amount = data.get('amount')
        category = data.get('category')
        notes = data.get('notes')
        
        # Check for all mandatory fields
        if not all([start_date, end_date, amount, category]):
            return jsonify({"error": "Missing required fields."}), 400
        
        # Validation check on start and end date
        start_date = validate_dates(start_date)
        end_date = validate_dates(end_date)

        if not start_date or not end_date:
            return jsonify({"error": "Invalid date format, please use YYYY-MM-DD."}), 400
        
        # Validation check for amount
        amount = validate_amount(amount)

        if amount is None:
            return jsonify({"error": "Amount must be a valid number greater than zero."}), 400

        db = get_db()
        
        # Debug Insertion check
        print(f"Inserting budget data with the user ID of: {user_id}")
        
        # Insert new budget entry into the db
        db.execute('''
            INSERT INTO budgets (user_id, start_date, end_date, amount, category, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, start_date, end_date, amount, category, notes))
        db.commit()

        return jsonify({"message": "Budget created successfully."}), 201
    
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500

# Get all user specific budgets in the specified month/year 
@budgets_bp.route('/list', methods=['GET'])
def list_budgets():
    try:
        # Authorization header extraction from request
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({"error": "Missing Authorization token."}), 403
        
        # Extract token from auth header
        token = auth_header.split(" ")[1]

        try:
            # Use secret key to decode token and retrieve user id
            decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

        # Store necessary query params from request
        data = request.args
        month = data.get('month')
        year = data.get('year')

        # Debug check for GET request
        print(f"Received GET request with user_id: {user_id}, month: {month}, year: {year}")

        # Check for all necessary fields
        if not user_id or not month or not year:
            return jsonify({"error": "Missing required parameters."}), 400
        
        # Format month into a 2 digit format (00)
        month = f"{int(month):02d}"
        
        db = get_db()

        # Query that groups all budgets based on category for that month/year
        budgets = db.execute('''
            SELECT category, SUM(amount) AS category_budget
            FROM budgets
            WHERE user_id = ? 
            AND strftime('%Y', start_date) = ?
            AND strftime('%m', start_date) = ?
            GROUP BY category
        ''', (user_id, year, month)).fetchall()

        # Debug query result check
        print(f"Query result: {budgets}")

        return jsonify([dict(budget) for budget in budgets]), 200
    
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500