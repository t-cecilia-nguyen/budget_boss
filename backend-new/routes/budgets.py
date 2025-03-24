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
    
# Validates amount_spent and caps negative values
def validate_amount_spent(amount_spent_str):
    try: 
        amount_spent = float(amount_spent_str)
        # if user enters negative number, cap entry to 0
        return 0 if amount_spent < 0 else amount_spent
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
        amount_spent = data.get('amount_spent', 0)
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
        
        # Validation check for amount_spent 
        amount_spent = validate_amount_spent(amount_spent)

        if amount_spent is None:
            return jsonify({"error": "Amount spent must be a valid number."}), 400

        # Connect to DB
        db = get_db()
        
        # Debug Insertion check
        print(f"Inserting budget data with the user ID of: {user_id}")
        
        # Insert new budget entry into the db
        db.execute('''
            INSERT INTO budgets (user_id, start_date, end_date, amount, amount_spent, category, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, start_date, end_date, amount, amount_spent, category, notes))
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
        
        # Connect to DB
        db = get_db()

        # Query that groups all budgets for that month/year
        budgets = db.execute('''
            SELECT id, amount, amount_spent, start_date, end_date, category, notes
            FROM budgets
            WHERE user_id = ? 
            AND strftime('%Y', start_date) = ?
            AND strftime('%m', start_date) = ?
        ''', (user_id, year, month)).fetchall()

        # Group budgets by category
        # Dictionary to hold grouped category data
        grouped = {}

        # Iterates over each budget entry from query
        for budget in budgets:

            # Get category of current budget
            category = budget['category']

            # Initialize category if it hasn't been iterated over yet
            if category not in grouped:
                grouped[category] = {
                    'category': category,
                    'category_budget': 0,
                    'category_spent': 0,
                    'entries': []
                }
            
            # Add current budget's amount to category budget total
            grouped[category]['category_budget'] += budget['amount']

            # Add current budget's amount spent to category spent total
            grouped[category]['category_spent'] += budget['amount_spent']

            # Add current budget's entry details to list of entries in the category
            grouped[category]['entries'].append({
                'id': budget['id'],
                'amount': budget['amount'],
                'amount_spent': budget['amount_spent'],
                'start_date': budget['start_date'],
                'end_date': budget['end_date'],
                'notes': budget['notes']
            })

        # Debug query result check
        print(f"Query result: {budgets}")

        return jsonify(list(grouped.values())), 200
    
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500

# Delete specific budget entry based off budget_id
@budgets_bp.route('/delete/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):

    try: 

        # Authorization header extraction from request
        auth_header = request.headers.get('Authorization')

        # If missing token
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
        
        # Connect to DB
        db = get_db()

        # Get specified budget based off its id 
        budget = db.execute('''
            SELECT * FROM budgets WHERE id = ? AND user_id = ? 
        ''', (budget_id, user_id)).fetchone()

        # if budget with that id could not be found
        if not budget:
            return jsonify({"error": f"Budget with ID {budget_id} could not be found."}), 404
        
        # Delete budget entry if found
        db.execute('DELETE FROM budgets WHERE id = ? AND user_id = ?', (budget_id, user_id))
        db.commit()

        # Success message
        return jsonify({"message": "Budget deleted successfully."}), 200
     
    # Exception catch 
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500
    
# Update specific budget based off budget_id
@budgets_bp.route('/update/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    
    try:
        
        # Authorization header extraction from request
        auth_header = request.headers.get('Authorization')

        # If missing token
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
        
        # Parse request data 
        data = request.get_json()
        start_date = validate_dates(data.get('startDate')) if data.get('startDate') else None
        end_date = validate_dates(data.get('endDate')) if data.get('endDate') else None
        amount = validate_amount(data.get('amount')) if data.get('amount') else None
        amount_spent = validate_amount_spent(data.get('amount_spent')) if data.get('amount_spent') else None
        category = data.get('category')
        notes = data.get('notes')

        # Connect to DB
        db = get_db()

        # Query DB with specified budget ID and user ID
        existing_budget = db.execute('''
            SELECT * FROM budgets WHERE id = ? AND user_id = ?
        ''', (budget_id, user_id)).fetchone()

        # If budget with that ID and user ID could not be found
        if not existing_budget:
            return jsonify({"error": f"Budget with ID {budget_id} could not be found."}), 404
        
        # Initialize empty arrays for storing update fields and their values
        update_fields = []
        values = []

        # Checks each field, and appends to SQL query if value is present
        if start_date:
            update_fields.append('start_date = ?')
            values.append(start_date)
        
        if end_date:
            update_fields.append('end_date = ?')
            values.append(end_date)

        if amount is not None:
            update_fields.append('amount = ?')
            values.append(amount)
        
        if amount_spent is not None:
            update_fields.append('amount_spent = ?')
            values.append(amount_spent)
        
        if category: 
            update_fields.append('category = ?')
            values.append(category)
        
        if notes is not None:
            update_fields.append('notes = ?')
            values.append(notes)
        
        # If no fields present to update
        if not update_fields:
            return jsonify({"error": "No valid fields have been provided to update."}), 400
        
        # Append budget ID and user ID to the WHERE clause of query
        values.extend([budget_id, user_id])

        # Construct query using appended fields and provided IDs
        query = f'''
            UPDATE budgets SET {', '.join(update_fields)}
            WHERE id = ? AND user_id = ?
        '''
        # Execute query using inserted values and save to DB
        db.execute(query, values)
        db.commit()

        # Success message
        return jsonify({"message": "Budget has been updated successfully."}), 200
    
    # General error catch 
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500