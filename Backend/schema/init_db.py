import os
import sqlite3

DATABASE = '../database.db'

def init_db():
    try:
        # Ensure the database directory exists
        db_path = os.path.abspath(DATABASE)
        print(f"Database path: {db_path}")

        # Connect to the database
        connection = sqlite3.connect(DATABASE)
        
        # Check if the schema file exists
        schema_file = os.path.join(os.path.dirname(__file__), 'schema.sql')
        if not os.path.exists(schema_file):
            raise FileNotFoundError(f"Schema file not found: {schema_file}")
        
        # Execute schema
        with open(schema_file, 'r') as f:
            connection.executescript(f.read())
        connection.commit()
        print("Database initialized successfully!")

        # Check if the seed data file exists
        seed_data_file = os.path.join(os.path.dirname(__file__), 'seed_data.sql')
        if os.path.exists(seed_data_file):
            with open(seed_data_file, 'r') as f:
                connection.executescript(f.read())
            connection.commit()
            print("Seed data inserted successfully!")
        else:
            print(f"Seed data file not found: {seed_data_file}")

    except Exception as e:
        print(f"Error initializing the database: {e}")
    finally:
        connection.close()

if __name__ == '__main__':
    init_db()