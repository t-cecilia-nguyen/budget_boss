from flask import Blueprint, request, jsonify, current_app
from database import get_db
import jwt
from werkzeug.security import generate_password_hash

profile_bp = Blueprint('profile', __name__)

# Retrieve user profile
@profile_bp.route('/user', methods=['GET'])
def get_profile():
    # Debug: Print when route hit
    print("Profile route hit")

    try:
        # Get Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing or invalid"}), 401

        # Extract token
        token = auth_header.split(" ")[1]

        try:
            # Decode the token and verify with secret key
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            print(f"Token payload: {payload}")

            if not user_id:
                return jsonify({"error": "Invalid token"}), 401

            # Fetch user info
            db = get_db()
            user = db.execute('''
                SELECT id, first_name, last_name, email
                FROM users
                WHERE id = ?
            ''', (user_id,)).fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404
            
            # Convert Row object to a dictionary
            user = {
                "id": user['id'],
                "firstName": user['first_name'],
                "lastName": user['last_name'],
                "email": user['email']
            }
            print(f"User: {user}")

            return jsonify(user), 200

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    except Exception as e:
        print(f"Error: {e}")  # Debug: Print any errors
        return jsonify({"error": str(e)}), 500

# Update user profile    
@profile_bp.route('/user', methods=['PUT'])
def update_profile():
    # Debug: Print when route hit
    print("Update profile route hit")

    try:
        # Get Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing or invalid"}), 401
        
        # Extract token
        token = auth_header.split(" ")[1]

        try:
            # Verify token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            print(f"Token payload: {payload}")

            if not user_id:
                return jsonify({"error": "Invalid token"}), 401

            # Get user info from request
            data = request.get_json()
            print(f"Data: {data}")
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')

            # Validate user info
            if not first_name or not last_name or not email:
                return jsonify({"error": "First name, last name, and email are required"}), 400

            # Update user info in database
            db = get_db()
            db.execute('''
                UPDATE users
                SET first_name = ?, last_name = ?, email = ?
                WHERE id = ?
            ''', (data['firstName'], data['lastName'], data['email'], user_id))
            db.commit()

            # Return success message
            return jsonify({"message": "Profile updated successfully"}), 200 
        
        except jwt.ExpiredSignatureError:
            # Return error message: Token has expired
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            # Return error message: Invalid token
            return jsonify({"error": "Invalid token"}), 401

    except Exception as e:
        print(f"Error: {e}")  # Debug: Print any errors
        return jsonify({"error": str(e)}), 500
    
# Update user password
@profile_bp.route('/password', methods=['PUT'])
def update_password():
    print("Update password route hit")

    try:
        # Get Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing or invalid"}), 401
        
        # Extract token
        token = auth_header.split(" ")[1]

        try:
            # Verify token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            print(f"Token payload: {payload}")

            if not user_id:
                return jsonify({"error": "Invalid token"}), 401

            # Get new password from request
            data = request.get_json()
            print(f"Data: {data}")
            new_password = data.get('password')

            # Validate new password
            if not new_password:
                return jsonify({"error": "New password is required"}), 400

            # Hash the new password
            hashed_password = generate_password_hash(new_password)

            # Update the password in the database
            db = get_db()
            db.execute('''
                UPDATE users
                SET password_hash = ?
                WHERE id = ?
            ''', (hashed_password, user_id))
            db.commit()

            # Return success message
            return jsonify({"message": "Password updated successfully"}), 200
        
        except jwt.ExpiredSignatureError:
            # Return error message: Token has expired
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            # Return error message: Invalid token
            return jsonify({"error": "Invalid token"}), 401

    except Exception as e:
        print(f"Error: {e}")  # Debug: Print any errors
        return jsonify({"error": str(e)}), 500
    

# Delete user account
@profile_bp.route('/delete', methods=['DELETE'])
def delete_user():
    print("Delete user route hit")

    try:
        # Get Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing or invalid"}), 401
        
        # Extract token
        token = auth_header.split(" ")[1]

        try:
            # Verify token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            print(f"Token payload: {payload}")

            if not user_id:
                return jsonify({"error": "Invalid token"}), 401
            
            # Get database connection and enable foreign key constraints
            db = get_db()
            db.execute('PRAGMA foreign_keys = ON;')

            # Delete user from database
            db.execute('''DELETE FROM users WHERE id = ?''', (user_id,))
            db.commit()

            # Return success message
            return jsonify({"message": "User deleted successfully"}), 200
        
        except jwt.ExpiredSignatureError:
            # Return error message: Token has expired
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            # Return error message: Invalid token
            return jsonify({"error": "Invalid token"}), 401     
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500