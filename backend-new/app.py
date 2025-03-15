from flask import Flask
from flask_cors import CORS
from routes import home, categories
from database import close_db
from schema.init_db import init_db
import secrets
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.budgets import budgets_bp
from routes.transactions import transactions_bp
from routes.createtransactions import create_transaction_bp
from routes.deletetransactions import delete_transaction_bp
import os

app = Flask(__name__)
CORS(app) 

# Generate secret key for JWT
app.config['SECRET_KEY'] = secrets.token_urlsafe(32) 

# Register blueprints
app.register_blueprint(home.bp)
app.register_blueprint(categories.bp)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(budgets_bp, url_prefix='/budgets')

# Transactions routes
app.register_blueprint(transactions_bp, url_prefix='/transactions')  # Fetch transactions
app.register_blueprint(create_transaction_bp, url_prefix='/transactions')  # Create transactions
app.register_blueprint(delete_transaction_bp, url_prefix='/transactions')  # DELETE transactions

# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':  # To avoid running init_db() twice when debug=True
        print("Initializing database...")
        init_db()  # Initialize
    app.run(host='127.0.0.1' , debug=True, port=5000)
