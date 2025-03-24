from werkzeug.security import generate_password_hash
import sqlite3

# Default categories for the seed user
DEFAULT_CATEGORIES = [
    ('Salary', 'Income', 'Debit', 'salary.png'),
    ('Investment', 'Income', 'Credit', 'investment.png'),
    ('Savings', 'Income', 'Credit', 'savings.png'),
    ('Freelance', 'Income', 'Credit', 'freelance.png'),
    ('Bonus', 'Income', 'Credit', 'bonus.png'),
    ('Food', 'Expense', 'Cash', 'food.png'),
    ('Transport', 'Expense', 'Cash', 'transport.png'),
    ('Utilities', 'Expense', 'Cash', 'utilities.png'),
    ('Rent', 'Expense', 'Cash', 'rent.png'),
    ('Groceries', 'Expense', 'Cash', 'groceries.png'),
    ('Entertainment', 'Expense', 'Cash', 'entertainment.png'),
    ('Healthcare', 'Expense', 'Cash', 'healthcare.png'),
    ('Education', 'Expense', 'Cash', 'education.png'),
    ('Clothing', 'Expense', 'Cash', 'clothing.png'),
    ('Subscriptions', 'Expense', 'Cash', 'subscriptions.png'),
    ('Gifts', 'Expense', 'Cash', 'gifts.png'),
    ('Travel', 'Expense', 'Cash', 'travel.png'),
    ('Vacation', 'Expense', 'Cash', 'vacation.png'),
    ('Insurance', 'Expense', 'Cash', 'insurance.png'),
    ('Mobile Bill', 'Expense', 'Cash', 'mobile.png'),
    ('Internet', 'Expense', 'Cash', 'internet.png'),
    ('Sports', 'Expense', 'Cash', 'sports.png'),
]

# Seed the user data
def seed_data(connection):
    try:
        # Test user data
        first_name = 'Test'
        last_name = 'User'
        email = 'test-user@email.com'
        password = 'Password123'

        # Hash the password
        password_hash = generate_password_hash(password)

        # Insert user into database
        cursor = connection.cursor()
        cursor.execute('''
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)
        ''', (first_name, last_name, email, password_hash))

        # Get the last inserted user ID
        user_id = cursor.lastrowid

        # Insert default categories for test user
        cursor.executemany('''
            INSERT INTO categories (name, type, description, img_name, user_id)
            VALUES (?, ?, ?, ?, ?)
        ''', [(name, type_, desc, img, user_id) for name, type_, desc, img in DEFAULT_CATEGORIES])

        # Commit changes to the database
        connection.commit()
        print(f"User created successfully with ID {user_id}")

    except Exception as e:
        print(f"Error seeding data: {e}")
