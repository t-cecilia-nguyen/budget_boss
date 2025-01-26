import sqlite3
from flask import g
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db():
    print("Getting database")
    try:
        if 'db' not in g:
            g.db = sqlite3.connect(DATABASE)
            g.db.row_factory = sqlite3.Row
        return g.db
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        raise

def close_db(e=None):
    print("Closing database")
    db = g.pop('db', None)
    if db is not None:
        db.close()