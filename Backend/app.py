from flask import Flask
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, close_db
from routes import home, categories
import jwt
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

<<<<<<< HEAD
# Manually Register blueprints
=======

# Register blueprints
app.register_blueprint(home.bp)
app.register_blueprint(categories.bp)
>>>>>>> b1562a15f9658298bb0fd6eb8dddc2129015c93e
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(transactions_bp, url_prefix='/transactions')




# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    init_db()  # Initialize
    app.run(host='127.0.0.1' , port=5000, debug=True)
