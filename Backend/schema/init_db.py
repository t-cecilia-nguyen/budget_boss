import os
import sqlite3


DATABASE = os.path.join(os.path.dirname(__file__), '../database.db')
SCHEMA = os.path.join(os.path.dirname(__file__), 'schema.sql')

def init_db():
    try:
        # Debug: Print paths
        #print(f"Database path: {os.path.abspath(DATABASE)}")
        #print(f"Schema path: {os.path.abspath(SCHEMA)}")

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
        print(f"Error initializing database: {e}")

    finally:
        connection.close()

if __name__ == "__main__":
    init_db()