# routes/home.py
from flask import Blueprint, jsonify, send_from_directory
from database import get_db

bp = Blueprint('categories', __name__)




@bp.route('/categories')
def get_categories():
    db = get_db()
    # Example query: Fetch all rows from a "categories" table
    categories = db.execute('SELECT * FROM categories').fetchall()
    # Return JSON response
    return jsonify([dict(c) for c in categories])


# Serve files from the uploads directory
@bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)
