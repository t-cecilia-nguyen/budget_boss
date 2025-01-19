from flask import Flask
from flask_cors import CORS
from database import get_db, close_db
from routes import home, categories

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(home.bp)
app.register_blueprint(categories.bp)


# Close database after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)

if __name__ == '__main__':
    app.run(host='127.0.0.1' , port=5000, debug=True)
