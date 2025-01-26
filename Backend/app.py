from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, init_db, close_db
from routes import home, categories
import jwt
import secrets
import datetime

app = Flask(__name__)
CORS(app) 

# Generate secret key for JWT
app.config['SECRET_KEY'] = secrets.token_urlsafe(32) 



# Register blueprints
app.register_blueprint(home.bp)
app.register_blueprint(categories.bp)

@app.before_request
def setup():
    init_db()

@app.route('/signup', methods=['POST'])
def signup():
    # Debug: Print when route hit
    print("Signup route hit")
    try:
        data = request.get_json()

        # Debug: Print the received data
        print("Received data:", data)

        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        if not first_name or not last_name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        password_hash = generate_password_hash(password)

        # Debug: Print data to be inserted
        print(f"Inserting user: {first_name} {last_name} with email {email}")

        db = get_db()
        db.execute('''
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)
        ''', (first_name, last_name, email, password_hash))
        db.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        print(f"Error: {e}")  # Debug: Print any errors
        return jsonify({"error": str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    # Debug: Print when route hit
    print("Login route hit")
    try:
        data = request.get_json()

        # Debug: Print the received data
        print("Received data:", data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        db = get_db()
        user = db.execute('''
            SELECT * FROM users WHERE email = ?
        ''', (email,)).fetchone()

        if user is None:
            return jsonify({"error": "Invalid email or password"}), 401

        # Check if password is correct
        if not check_password_hash(user['password_hash'], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token (valid for 1 hour)
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.now(datetime.timezone.utc)  + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Login successful',
            'token': token
        }), 200

    except Exception as e:
        print(f"Error: {e}")  # Debug: Print any errors
        return jsonify({"error": str(e)}), 500
    
@app.route('/profile', methods=['GET'])
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
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
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

# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    app.run(host='127.0.0.1' , port=5000, debug=True)
