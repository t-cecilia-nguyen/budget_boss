DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;

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

INSERT INTO transactions (user_id, amount, category, type, date, note, icon) 
VALUES
    (1, 200.0, 'Groceries', 'expense', '2025-01-11', 'Weekly grocery shopping', 'https://cdn-icons-png.flaticon.com/512/1261/1261163.png'),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-01-15', 'Dinner at a fancy restaurant', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-01-15', 'Dinner at a fancy restaurant', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 150.0, 'Dining Out', 'expense', '2025-01-15', 'Lunch with friends', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 100.0, 'Freelance Work', 'income', '2025-01-20', 'Payment for freelance project', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbwVefKlscDH1ffNFGLeWv9W0WUXWZgxwq4w&s'),
    (1, 50.0, 'Entertainment', 'expense', '2025-01-25', 'Movie night with family', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ1hdffCPv9apz2ovZydUT8VYCRg0GJU8Kw&s');

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

INSERT INTO categories (user_id, name, type, description, img_name)
VALUES 
    (1,'Salary', 'Income', 'Debit', 'salary.png'),
    (1,'Investment', 'Income', 'Credit', 'investment.png'),
    (1,'Savings', 'Income', 'Credit', 'savings.png'),
    (1,'Freelance', 'Income', 'Credit', 'freelance.png'),
    (1,'Bonus', 'Income', 'Credit', 'bonus.png'),
    (1,'Food', 'Expense', 'Cash', 'food.png'),
    (1,'Transport', 'Expense', 'Cash', 'transport.png'),
    (1,'Utilities', 'Expense', 'Cash', 'utilities.png'),
    (1,'Rent', 'Expense', 'Cash', 'rent.png'),
    (1,'Groceries', 'Expense', 'Cash', 'groceries.png'),
    (1,'Entertainment', 'Expense', 'Cash', 'entertainment.png'),
    (1,'Healthcare', 'Expense', 'Cash', 'healthcare.png'),
    (1,'Education', 'Expense', 'Cash', 'education.png'),
    (1,'Clothing', 'Expense', 'Cash', 'clothing.png'),
    (1,'Subscriptions', 'Expense', 'Cash', 'subscriptions.png'),
    (1,'Gifts', 'Expense', 'Cash', 'gifts.png'),
    (1,'Travel', 'Expense', 'Cash', 'travel.png'),
    (1,'Vacation', 'Expense', 'Cash', 'vacation.png'),
    (1,'Insurance', 'Expense', 'Cash', 'insurance.png'),
    (1,'Mobile Bill', 'Expense', 'Cash', 'mobile.png'),
    (1,'Internet', 'Expense', 'Cash', 'internet.png'),
    (1,'Sports', 'Expense', 'Cash', 'sports.png');


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
