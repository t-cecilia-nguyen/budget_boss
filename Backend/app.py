from flask import Flask
from database import get_db, close_db
from routes import home

app = Flask(__name__)

# Register blueprints
app.register_blueprint(home.bp)


# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    app.run(debug=True)
