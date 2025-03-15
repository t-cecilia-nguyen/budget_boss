-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS transactions;
-- DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    date TEXT NOT NULL,
    note TEXT,
    icon TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

--DROP TABLE IF EXISTS categories;
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    img_name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed data for Income categories

--INSERT INTO categories (user_id, name, type, description, img_name)
--VALUES 
--    (1,'Salary', 'Income', 'Debit', 'salary.png'),
--    (1,'Investment', 'Income', 'Credit', 'investment.png'),
--    (1,'Savings', 'Income', 'Credit', 'savings.png'),
--    (1,'Freelance', 'Income', 'Credit', 'freelance.png'),
--    (1,'Bonus', 'Income', 'Credit', 'bonus.png'),
--    (1,'Food', 'Expense', 'Cash', 'food.png'),
--    (1,'Transport', 'Expense', 'Cash', 'transport.png'),
--    (1,'Utilities', 'Expense', 'Cash', 'utilities.png'),
--    (1,'Rent', 'Expense', 'Cash', 'rent.png'),
--    (1,'Groceries', 'Expense', 'Cash', 'groceries.png'),
--    (1,'Entertainment', 'Expense', 'Cash', 'entertainment.png'),
--    (1,'Healthcare', 'Expense', 'Cash', 'healthcare.png'),
--    (1,'Education', 'Expense', 'Cash', 'education.png'),
--    (1,'Clothing', 'Expense', 'Cash', 'clothing.png'),
--    (1,'Subscriptions', 'Expense', 'Cash', 'subscriptions.png'),
--    (1,'Gifts', 'Expense', 'Cash', 'gifts.png'),
--    (1,'Travel', 'Expense', 'Cash', 'travel.png'),
--    (1,'Vacation', 'Expense', 'Cash', 'vacation.png'),
--    (1,'Insurance', 'Expense', 'Cash', 'insurance.png'),
--    (1,'Mobile Bill', 'Expense', 'Cash', 'mobile.png'),
--    (1,'Internet', 'Expense', 'Cash', 'internet.png'),
--    (1,'Sports', 'Expense', 'Cash', 'sports.png');


-- DROP TABLE IF EXISTS budgets;

CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
