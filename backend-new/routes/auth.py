from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

# User signup
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        # Get JSON data from request
        data = request.get_json()
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        if not first_name or not last_name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        # Hash the password
        password_hash = generate_password_hash(password)

        # Insert user into database
        db = get_db()
        db.execute('''
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)
        ''', (first_name, last_name, email, password_hash))
        db.commit()

        # Return success message
        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        print(f"Error: {e}")
        # Return error message
        return jsonify({"error": str(e)}), 500

# User login
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Get JSON data from request
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        # Check if user exists
        db = get_db()
        user = db.execute('''
            SELECT * FROM users WHERE email = ?
        ''', (email,)).fetchone()

        # Return error if user does not exist
        if user is None:
            return jsonify({"error": "Invalid email or password"}), 401
        # Check if password is correct
        if not check_password_hash(user['password_hash'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Create JWT token for user
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Login successful', # Return success message
            'token': token # Return JWT token
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        # Return error message
        return jsonify({"error": str(e)}), 500