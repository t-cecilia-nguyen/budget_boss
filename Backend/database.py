import sqlite3
from flask import g
import os

#DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
DATABASE = "./database.db"

print(f"Database path: {DATABASE}")
def get_db():
    try:
        if 'db' not in g:
            g.db = sqlite3.connect(DATABASE)

            g.db.row_factory = sqlite3.Row
        return g.db
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        raise

def init_db():
    db = get_db()
    db.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    )''')
    db.commit()

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()