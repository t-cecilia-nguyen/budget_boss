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

### Expo CLI Setup

- Ensure you have **Node.js** installed, then install Expo CLI globally:  
    ```
    npm install -g expo-cli
    ```

### Android Studio Setup

- Download the latest version of [Android Studio](https://developer.android.com/studio).

## :rocket: Running the Full Application
    
- Run on an emulator:

    - Open **Android Studio** and go to **Tools > Device Manager**.

    - Create a new emulator (click the **`+`** to create a new virtual device) or select an existing device.

    - Click the **`▶`** (play button) to launch the emulator.

    - Once the emulator is running, execute the following command in your terminal to launch the app on the emulator:

### Start the backend server (Flask)

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

### Start the frontend (React Native)

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

## :package: Dependencies

### :iphone: Frontend (React Native)
- **@react-native-async-storage/async-storage**: For storing data locally on the device.
- **@react-native-community/datetimepicker**: To provide date and time pickers.
- **@react-native-picker/picker**: For implementing pickers in the app.
- **@react-navigation/bottom-tabs**: For managing bottom navigation tabs.
- **@react-navigation/drawer**: For implementing drawer navigation.
- **@react-navigation/native**: Core navigation library for React Native.
- **@react-navigation/stack**: For implementing stack-based navigation.
- **axios**: For making HTTP requests to the backend.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **date-fns**: For manipulating and formatting dates.
- **expo**: Framework and platform for universal React applications.
- **expo-constants**: For accessing system constants.
- **expo-linear-gradient**: For creating gradient backgrounds.
- **expo-splash-screen**: For handling splash screens.
- **expo-status-bar**: For managing the status bar in your app.
- **moment**: For parsing, validating, and manipulating dates and times.
- **react**: JavaScript library for building user interfaces.
- **react-native**: Framework for building native apps using React.
- **react-native-chart-kit**: For displaying charts and graphs.
- **react-native-dropdown-picker**: For implementing dropdown menus.
- **react-native-gesture-handler**: For handling gestures in React Native.
- **react-native-gifted-charts**: For displaying advanced charts.
- **react-native-linear-gradient**: For adding linear gradients to your components.
- **react-native-modal**: For showing modal dialogs.
- **react-native-modal-datetime-picker**: For selecting dates and times via a modal.
- **react-native-progress**: For showing progress indicators.
- **react-native-svg**: For rendering SVG images.
- **react-native-toast-message**: For showing toast messages.
- **react-native-vector-icons**: For using customizable icons in your app.

#### Development Dependencies
- **@babel/core**: Core compiler for Babel, which compiles JavaScript code.
- **@react-native-community/cli**: Command-line interface for React Native.

### :computer: Backend (Python)

- **aiohttp**: For asynchronous HTTP client/server framework.
- **aiosignal**: Signal handler for `asyncio` applications.
- **altgraph**: A dependency for building and working with graphs.
- **asttokens**: For working with Python AST (Abstract Syntax Tree).
- **attrs**: For easier handling of class attributes in Python.
- **beautifulsoup4**: For parsing HTML and XML documents.
- **bleach**: A library for cleaning HTML.
- **blinker**: A fast and simple object-to-object and broadcast signaling library.
- **certifi**: A library that provides Mozilla’s CA bundle in Python.
- **cffi**: A foreign function interface for Python calling C code.
- **charset-normalizer**: For automatic character encoding detection and normalization.
- **click**: A command-line interface creation library.
- **colorama**: Cross-platform colored terminal text in Python.
- **cryptography**: For encryption and decryption functionalities.
- **debugpy**: A debugger for Python.
- **Flask**: A lightweight web framework for Python.
- **Flask-Cors**: For handling Cross-Origin Resource Sharing (CORS) in Flask.
- **frozenlist**: A library that provides thread-safe, immutable lists.
- **h11**: A library for building HTTP/1.1-compliant protocols.
- **idna**: A library for internationalized domain names.
- **ipython**: An interactive Python shell.
- **itsdangerous**: A library for securely signing data.
- **Jinja2**: A templating engine for Python.
- **jsonschema**: For validating JSON data against a schema.
- **jwt**: JSON Web Token implementation for encoding and decoding tokens.
- **MarkupSafe**: For safe handling of strings that will be used in HTML.
- **matplotlib-inline**: For integrating inline plotting in Jupyter notebooks.
- **mysql-connector-python**: MySQL client for Python.
- **requests**: For making HTTP requests in Python.
- **selenium**: For automating web browser interaction.
- **setuptools**: Python tool to facilitate packaging and distributing Python projects.
- **six**: A compatibility library for Python 2 and 3.
- **Werkzeug**: A comprehensive WSGI web application library.

#### Development Dependencies
- **pytest**: Framework for writing and running tests in Python.
- **pylint**: A source code, linting tool for Python.
- **black**: A code formatter for Python.
- **flake8**: A linting tool to enforce coding standards in Python projects.