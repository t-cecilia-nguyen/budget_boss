from flask import Flask
from flask_cors import CORS
from database import close_db
from routes import home, categories
from schema.init_db import init_db
import os
import sqlite3
from database import close_db
import secrets
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.budgets import budgets_bp
from routes.transactions import transactions_bp

DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
print("Current Working Directory:", os.getcwd())

app = Flask(__name__)
CORS(app) 

# Generate secret key for JWT
app.config['SECRET_KEY'] = secrets.token_urlsafe(32) 

# Register blueprints
app.register_blueprint(home.bp)
app.register_blueprint(categories.bp)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(budgets_bp, url_prefix='/budgets')
app.register_blueprint(transactions_bp, url_prefix='/transactions')

# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

def verify_tables():
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    connection.close()
    print("Existing Tables:", tables)

if __name__ == '__main__':
    # init_db()
    # verify_tables() 
    app.run(host='127.0.0.1', port=5000, debug=True)