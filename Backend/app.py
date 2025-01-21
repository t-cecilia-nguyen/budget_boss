from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from database import get_db, init_db, close_db
from routes import home

app = Flask(__name__)
CORS(app) 

# Register blueprints
app.register_blueprint(home.bp)

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

# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    app.run(debug=True)
