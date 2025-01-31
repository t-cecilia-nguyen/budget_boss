from flask import Blueprint, request, jsonify
from database import get_db

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/transactions', methods=['POST'])
def get_transactions():
    print("Transactions route hit")

    try:

        data = request.get_json()

        user_id = data.get('user_id')
        month = data.get('month')  # Expected in 'MM' format
        year = data.get('year')    # Expected in 'YYYY' format

        if not user_id or not month or not year:
            return jsonify({"error": "User ID, month, and year are required"}), 400


        date_from = f"{year}-{month}-01"
        date_to = f"{year}-{month}-31" 


        db = get_db()
        transactions = db.execute('''
            SELECT id, user_id, amount, category, type, date, note, icon
            FROM transactions
            WHERE user_id = ? 
            AND date BETWEEN ? AND ?
            ORDER BY date DESC
        ''', (user_id, date_from, date_to)).fetchall()

        if not transactions:
            return jsonify({"error": "No transactions found for this user in the given month"}), 404


        transactions_list = [
            {
                "id": transaction['id'],
                "user_id": transaction['user_id'],
                "amount": transaction['amount'],
                "category": transaction['category'],
                "type": transaction['type'],
                "date": transaction['date'],
                "note": transaction['note'],
                "icon": transaction['icon']
            }
            for transaction in transactions
        ]
        print(f"Transactions: {transactions_list}")


        return jsonify(transactions_list), 200

    except Exception as e:
        print(f"Error: {e}")  
        return jsonify({"error": str(e)}), 500

# Create transactions
@transactions_bp.route('/transactions', methods=['POST'])
def create_transaction():
    print("Creating transaction...")

    try:
        # Extract data from the request
        data = request.get_json()

        # Ensure necessary fields are present
        user_id = data.get('user_id')
        amount = data.get('amount')
        category = data.get('category')  # Category name
        type = data.get('type')  # Type could be "income" or "expense"
        date = data.get('date')  # Format: 'YYYY-MM-DD'
        note = data.get('note')
        icon = data.get('icon')  # We will add the icon here later

        if not all([user_id, amount, category, type, date]):
            return jsonify({"error": "All fields are required"}), 400

        # Fetch the img_name (icon) from the categories table based on the category name
        db = get_db()
        category_info = db.execute('''
            SELECT img_name FROM categories WHERE name = ? AND user_id = ?
        ''', (category, user_id)).fetchone()

        if not category_info:
            return jsonify({"error": "Category not found for this user"}), 404

        # Get the icon (img_name) from the category
        icon = category_info['img_name']

        # Insert transaction into database
        db.execute('''
            INSERT INTO transactions (user_id, amount, category, type, date, note, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, amount, category, type, date, note, icon))
        db.commit()

        return jsonify({"message": "Transaction created successfully"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
