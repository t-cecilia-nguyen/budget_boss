from flask import Flask
from flask_cors import CORS
from database import close_db
from schema.init_db import init_db
import secrets
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.transactions import transactions_bp


app = Flask(__name__)
CORS(app) 

# Generate secret key for JWT
app.config['SECRET_KEY'] = secrets.token_urlsafe(32) 

# Manually Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(transactions_bp, url_prefix='/transactions')




# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    init_db()  # Initialize
    app.run(debug=True)
