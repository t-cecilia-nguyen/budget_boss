from flask import Blueprint, request, jsonify
from database import get_db

create_transaction_bp = Blueprint('create_transaction', __name__)

@create_transaction_bp.route('/transactions/create', methods=['POST'])
def create_transaction():
    print("Creating transaction...")

    try:
        data = request.get_json()

        user_id = data.get('user_id')
        amount = data.get('amount')
        category = data.get('category')
        type = data.get('type')
        date = data.get('date')
        note = data.get('note', '')
        icon = data.get('icon', '')

        if not all([user_id, amount, category, type, date]):
            return jsonify({"error": "All fields are required"}), 400

        db = get_db()
        category_info = db.execute('''
            SELECT img_name FROM categories WHERE name = ? AND user_id = ?
        ''', (category, user_id)).fetchone()

        if not category_info:
            return jsonify({"error": "Category not found for this user"}), 404

        icon = icon or category_info['img_name']

        db.execute('''
            INSERT INTO transactions (user_id, amount, category, type, date, note, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, amount, category, type, date, note, icon))
        db.commit()

        return jsonify({"message": "Transaction created successfully"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
