# routes/home.py
from flask import Blueprint, jsonify, send_from_directory, request, current_app
from database import get_db
import jwt

bp = Blueprint('categories', __name__)



# To fetch a specific category based on name: /categories?name=Food
#To fetch all categories:  /categories

@bp.route('/categories')
def get_categories():
    db = get_db()
   
    # Authenticate user
    auth_result = authenticate_request()
    if isinstance(auth_result, tuple):  # If authentication failed
        return jsonify(auth_result[0]), auth_result[1]
    
    user_id = auth_result  

    try:
        category_name = request.args.get('name')
        
        if category_name:
            # Fetch category by name
            category = db.execute('SELECT * FROM categories WHERE name = ?, user_id', (category_name, user_id,)).fetchone()
            if category:
                return jsonify(dict(category))
            else:
                return jsonify({"error": "Category not found"}), 404
        else:
            # Fetch all categories for the authenticated user
            categories = db.execute('SELECT * FROM categories WHERE user_id = ?', (user_id,)).fetchall()

            if categories:
                return jsonify([dict(category) for category in categories])
            else:
                return jsonify([])  # Empty list for no categories found

    except Exception as err:
        # Detailed error logging for debugging
        print(f"Error: {err}")
        return jsonify({"error": f"An error occurred: {str(err)}"}), 500



@bp.route('/categories/create', methods=['POST'])
def create_category():
    db = get_db()
    data = request.get_json()

    # Authenticate user
    auth_result = authenticate_request()
    if isinstance(auth_result, tuple):  # If authentication failed
        return jsonify(auth_result[0]), auth_result[1]
    
    user_id = auth_result  


    # Validate required fields
    name = data.get('name')
    description = data.get('description')
    category_type = data.get('type')
    img_name = data.get('img_name', 'default.png')

    if not name or not category_type:
        print("Missing Name and type fields")
        return jsonify({"error": "Name and type are required fields"}), 400

    try:
        # Validate user_id exists in the users table
        user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        if user is None:
            return jsonify({"error": "Invalid user ID"}), 400

        # Check if the category name already exists for the user
        existing_category = db.execute(
            'SELECT * FROM categories WHERE name = ? AND user_id = ?',
            (name, user_id)
        ).fetchone()

        if existing_category:
            print("Category name already exists for this user")
            return jsonify({"error": "Category name already exists for this user"}), 409

        # Insert into the categories table
        db.execute(
            'INSERT INTO categories (user_id, name, description, type, img_name) VALUES (?, ?, ?, ?, ?)',
            (user_id, name, description, category_type, img_name)
        )
        db.commit()
        return jsonify({"message": "Category created successfully"}), 201
    except Exception as e:
        import traceback
        print("Error creating category:", traceback.format_exc())  # Log the full error traceback
        db.rollback()
        return jsonify({"error": "Internal server error. Please check the logs."}), 500
       





#http://10.0.2.2:5000/categories/update
@bp.route('/categories/update', methods=['PUT'])
def update_category():
    db = get_db()
    data = request.get_json()

    # Authenticate user
    auth_result = authenticate_request()
    if isinstance(auth_result, tuple):  # If authentication failed
        return jsonify(auth_result[0]), auth_result[1]
    
    user_id = auth_result  

    print("Data to update: ", data)

    category_id = data.get('category_id')
    category_name = data.get('name')
   
    if not category_id or not user_id:
        print("error: Category ID and User ID are required")
        return jsonify({"error": "Category ID and User ID are required"}), 400
        
    # Check if the category exists and belongs to the user
    category = db.execute('''
        SELECT * FROM categories WHERE category_id = ? AND user_id = ?
    ''', (category_id, user_id)).fetchone()

    if not category:
        print("error: Category not found or user does not own this category")
        return jsonify({"error": "Category not found or user does not own this category"}), 404

    # Check if the new name is unique among all the user’s categories 
    existing_category = db.execute('''
        SELECT * FROM categories WHERE name = ? AND user_id = ? AND category_id != ?
    ''', (category_name, user_id, category_id)).fetchone()

    if existing_category:
        print("error: Category name already exists for this user")
        return jsonify({"error": "Category name already exists for this user"}), 409

        
    # Prepare dynamic SQL based on provided fields
    fields = []
    values = []
    for key in ['name', 'description', 'type', 'img_name']:
        if key in data:
            fields.append(f"{key} = ?")
            values.append(data[key])

    # Check if 'img_name' is not provided and set default value
    if 'img_name' not in data:
        fields.append("img_name = ?")
        values.append("default.png")

    if not fields:
        return jsonify({"error": "No fields to update provided"}), 400

    # Add the ID for the WHERE clause
    values.append(category_id)

    # Build the SQL statement dynamically
    sql = f"UPDATE categories SET {', '.join(fields)} WHERE category_id = ?"

    try:
        db.execute(sql, values)
        db.commit()
        return jsonify({"message": "Category updated successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500



@bp.route('/categories/delete', methods=['DELETE'])
def delete_category():
    db = get_db()

    # Authenticate user
    auth_result = authenticate_request()
    if isinstance(auth_result, tuple):  # If authentication failed
        return jsonify(auth_result[0]), auth_result[1]
    
    user_id = auth_result  

    # Ensure catgory_id is  provided
    category_id = request.args.get('id')

    print("categoryid: ", category_id, "userid:" , user_id)

    if not category_id or not user_id:
        return jsonify({"error": "Category ID and userId are required"}), 400

    try:
        # Execute delete query
        db.execute('DELETE FROM categories WHERE category_id = ? AND user_id = ?', (category_id, user_id))
        db.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500



def authenticate_request():

    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return {"error": "Missing authorization token."}, 403

    try:
        token = auth_header.split(" ")[1]  # Extract the token part
        print("Token:", token)
    except IndexError:
        return {"error": "Invalid token format."}, 401

    try:
        # Decode token to retrieve user_id
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        if not user_id:
            return {"error": "Invalid token payload."}, 401

        return user_id  # Return user_id if authentication is successful

    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired."}, 401
    except jwt.InvalidTokenError:
        return {"error": "Invalid token."}, 401


# Serve files from the uploads directory
@bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)



