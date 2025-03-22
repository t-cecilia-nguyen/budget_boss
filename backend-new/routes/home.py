# routes/home.py
from flask import Blueprint, jsonify
from database import get_db

bp = Blueprint('home', __name__)

#@bp.route('/')
#def home():
#    db = get_db()
#    # Example query: Fetch all rows from a "users" table
#    users = db.execute('SELECT * FROM users').fetchall()
#    # Return JSON response
#    return jsonify([dict(user) for user in users])