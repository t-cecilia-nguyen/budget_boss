# :blue_book: Budget Boss

A user-friendly mobile application designed to help individuals take control of their finances. 
With seamless access to financial information on mobile platforms, Budget Boss empowers users to effectively manage their budget anytime and anywhere. 
The app provides essential features such as income and expense tracking, personalized budgeting recommendations, and automated milestone calculations. 
Visual graphs and data insights further enhance users' understanding of their financial habits, helping them make informed decisions and improve their overall financial health.

## :star2: Features

- Track and manage income and expenses with ease

- Access a comprehensive overview of monthly expenses

- Set, monitor, and adjust budgets to stay on top of financial goals

- Customize categories to your unique financial needs

- Visualize spending versus budgeting through insightful graphs

- Receive helpful reminders and notifications to stay on track with your budget

- Ensure secure authentication with token-based access

- Enjoy a user-friendly interface designed for seamless navigation

## :books: Tech Stack

- Frontend: React Native (Expo)

- Backend: Flask (Python)

- Database: SQLite

## :wrench: Installation & Setup

### :iphone: Frontend (React Native)

- Navigate to the frontend directory:

    ```
    cd budget_boss
    ```
- Install dependencies:

    ```
    npm install
    ```

- Start the development server:

    ```
    npm start
    ```
### :computer: Backend (Flask)

- Navigate to the backend directory:

    ```
    cd backend-new
    ```

- Create a virtual environment:

    ```
    python -m venv venv
    ```

- Activate the virtual environment:

    ```
    .\.venv\Scripts\activate
    ```

- Install backend dependencies:

    ```
    pip install -r requirements.txt
    ```

- Run the Flask server:

    ```
    python app.py
    ```

## :rocket: Running the Full Application
    
- Run on an emulator:

    - Open **Android Studio** and go to **Tools > Device Manager**.

    - Create a new emulator (click the **`+`** to create a new virtual device) or select an existing device.

    - Click the **`▶`** (play button) to launch the emulator.

    - Once the emulator is running, execute the following command in your terminal to launch the app on the emulator:

        - **Start the backend server**:
        
            ```
            python app.py
            ```
        
        - **Start the frontend app**:
        
            ```
            npm start
            ```

## :key: Logging In

To log in to the app, use the credentials for the test user created during the database seeding process. The default test user can be found in the `seed_user_data.py` file, located in the `backend-new/schema` directory.

### Default Test User Credentials

- Email: `test-user@email.com`
- Password: `Password123` (This password is hashed in the database)

You can use these credentials to log in during development. If you need to modify or update the test user data, please follow these steps:

- Open the `seed_user_data.py` file.
- The relevant code snippet for the test user data is as follows:
    ```
    # Seed the user data
    def seed_data(connection):
    try:
        # Test user data
        first_name = 'Test'
        last_name = 'User'
        email = 'test-user@email.com'
        password = 'Password123'
    ```
    In this block, you can modify the `first_name`, `last_name`, `email`, and `password` fields.

After making changes, the updated user data will be inserted into the database when the `seed_data()` function runs. Be sure to delete the `database.db` file if it already exists to start fresh and ensure a clean setup.

### Seed Data for Transactions and Budgets

The `seed_data.sql` file contains predefined transactions and budget entries designed for testing different financial scenarios, including low balance, surplus, and negative budget conditions. It also includes various income and expense categories, along with sample transactions spanning multiple months.