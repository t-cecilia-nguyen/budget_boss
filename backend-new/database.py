import sqlite3
from flask import g
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
#DATABASE = "./database.db"

print(f"Database path: {DATABASE}")

# Get database connection
def get_db():
    print("Getting database")
    try:
        # Check if database connection is already open
        if 'db' not in g:
            # Open a new connection
            g.db = sqlite3.connect(DATABASE)
            # Enable row access by column name
            g.db.row_factory = sqlite3.Row
        # Return the connection
        return g.db
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        raise

# Close database connection
def close_db(e=None):
    print("Closing database")
    # Check if database connection is open
    db = g.pop('db', None)
    # Close the connection
    if db is not None:
        db.close()