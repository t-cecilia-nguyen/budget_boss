# routes/home.py
from flask import Blueprint, jsonify, send_from_directory, request
from database import get_db

bp = Blueprint('categories', __name__)



# To fetch a specific category based on name: /categories?name=Food
#To fetch all categories:  /categories

@bp.route('/categories')
def get_categories():
    db = get_db()
   
    # Get the category name from query parameters
    category_name = request.args.get('name')
    
    if category_name:
        # Fetch category based on the name
        category = db.execute('SELECT * FROM categories WHERE name = ?', (category_name,)).fetchone()
        if category:
            return jsonify(dict(category))
        else:
            return jsonify({"error": "Category not found"}), 404
    else:
        # Fetch all categories if no name is provided
        categories = db.execute('SELECT * FROM categories').fetchall()
        return jsonify([dict(c) for c in categories])

@bp.route('/categories/create', methods=['POST'])
def create_category():
    db = get_db()
    data = request.get_json()

    # Validate required fields
    name = data.get('name')
    description = data.get('description')
    category_type = data.get('type')
    img_name = data.get('img_name', 'default.png')
    user_id = data.get('user_id')

    if not user_id:
            return jsonify({"error": "Missing user ID"}), 400
    if not name or not category_type :
        return jsonify({"error": "Name and type are required fields"}), 400

    

    try:
         # Validate user_id exists in the users table
        user = db.execute('''
            SELECT * FROM users WHERE user_id = ?
        ''', (user_id,)).fetchone()

        if user is None:
            return jsonify({"error": "Invalid user ID"}), 400

        # Insert into the categories table
        db.execute(
            'INSERT INTO categories (user_id, name, description, type, img_name) VALUES (?, ?, ?, ?)',
            (user_id, name, description, category_type, img_name)
        )
        db.commit()
        return jsonify({"message": "Category created successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500





#http://10.0.2.2:5000/categories/update
@bp.route('/categories/update', methods=['PUT'])
def update_category():
    db = get_db()
    data = request.get_json()

    print("Data to update: ", data)
    # Ensure `id` is provided
    category_id = data.get('category_id')
    user_id = data.get('userId')

    if not category_id or not user_id:
        return jsonify({"error": "Category ID and User ID are required"}), 400

    # Check if the category exists and belongs to the user
    category = db.execute('''
        SELECT * FROM categories WHERE category_id = ? AND user_id = ?
    ''', (category_id, user_id)).fetchone()

    if not category:
        return jsonify({"error": "Category not found or user does not own this category"}), 404

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


# @app.route('/categories/update', methods=['PUT'])
# def update_category():

    # # Check if Content-Type is multipart/form-data
    # if not request.content_type.startswith('multipart/form-data'):
    #     abort(415, description="Unsupported Media Type. Please send data as multipart/form-data.")

    # # Retrieve form data
    # category_name = request.form.get('name')
    # category_description = request.form.get('description')
    # category_type = request.form.get('type', 'Expense')  # Default to 'Expense' if not provided
    # category_image = request.files.get('img_name')  # Assuming 'img_name' is the field for image upload

    # # Validate required fields
    # if not category_name or not category_description:
    #     return jsonify({"error": "Missing required fields"}), 400

    # # Handle the image upload if present
    # if category_image:
    #     # Save the image file or process it as needed
    #     image_filename = category_image.filename
    #     category_image.save(f'./uploads/{image_filename}')  # Example of saving the image to the server
    # else:
    #     image_filename = 'default.png'  # Default image if none is uploaded

    # # Process the category data and update the database
    # # db.execute('UPDATE categories SET name = ?, description = ?, type = ?, img_name = ? WHERE id = ?',
    # #            (category_name, category_description, category_type, image_filename, category_id))

    # # Return a success response
    # return jsonify({
    #     "message": "Category updated successfully",
    #     "name": category_name,
    #     "description": category_description,
    #     "type": category_type,
    #     "img_name": image_filename
    # })



@bp.route('/categories/delete', methods=['DELETE'])
def delete_category():
    db = get_db()
    data = request.get_json()

    # Ensure `id` is provided
    category_id = data.get('id')
    if not category_id:
        return jsonify({"error": "Category ID is required"}), 400

    try:
        # Execute delete query
        db.execute('DELETE FROM categories WHERE id = ?', (category_id,))
        db.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500



# Serve files from the uploads directory
@bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)



if __name__ == '__main__':
    app.run(debug=True)
