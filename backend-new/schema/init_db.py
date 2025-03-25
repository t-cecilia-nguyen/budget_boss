import os
import sqlite3
from schema.seed_user_data import seed_data # import seed data for test user

print("Current Working Directory:", os.getcwd())

DATABASE = os.path.join(os.path.dirname(__file__), '../database.db')
SCHEMA = os.path.join(os.path.dirname(__file__), 'schema.sql')
SEED_DATA = os.path.join(os.path.dirname(__file__), 'seed_data.sql')

def is_database_empty(connection):
    tables_query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    tables = connection.execute(tables_query).fetchall()

    if not tables:
        return True
    
    for (table_name,) in tables:
        count_query = f"SELECT COUNT(*) FROM {table_name};"
        count = connection.execute(count_query).fetchone()[0]
        if count > 0:
            return False # If any table has data, return False
        
    return True # If all tables are empty, return True

def init_db():
    try:
        # Debug: Print paths
        print(f"Database path: {os.path.abspath(DATABASE)}")
        print(f"Schema path: {os.path.abspath(SCHEMA)}")

        # Connect to SQLite
        connection = sqlite3.connect(DATABASE)


        # Ensure schema file exists
        if not os.path.exists(SCHEMA):
            raise FileNotFoundError(f"Schema file not found: {SCHEMA}")

        # Read and execute schema.sql
        with open(SCHEMA, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            print("Executing schema.sql:")
            # Debug: Print script
            print(sql_script)
        
            connection.executescript(sql_script)
            connection.commit()

        print("Database initialized successfully!")
        
        # Check if the database is empty before inserting seed data
        if is_database_empty(connection):
            with open(SEED_DATA, 'r') as f:
                seed_script = f.read()
                print("Executing seed_data.sql:")
                # Debug: Print script
                # print(seed_script)
                connection.executescript(seed_script) # Execute seed data script
                connection.commit()
                print("Seed data inserted successfully!")
            seed_data(connection) # Seed test user data
        else:
            print(f"Database is not empty or seed data file not found: {SEED_DATA}")

    except Exception as e:
        print(f"Error initializing database: {e}")

    finally:
        connection.close()

if __name__ == "__main__":
    init_db()