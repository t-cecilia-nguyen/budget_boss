
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
