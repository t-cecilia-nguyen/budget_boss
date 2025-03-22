from flask import Blueprint, request, jsonify
from database import get_db


delete_transaction_bp = Blueprint('delete_transaction', __name__)

@delete_transaction_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    print(f"Delete transaction request received for ID: {transaction_id}")

    try:
        db = get_db()
        transaction = db.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,)).fetchone()

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        db.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
        db.commit()  # Ensure transaction is removed from the database

        print(f"Transaction ID {transaction_id} deleted successfully.")
        return jsonify({"message": "Transaction deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting transaction: {e}")
        return jsonify({"error": str(e)}), 500
