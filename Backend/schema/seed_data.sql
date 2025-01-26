-- Seed data for Income categories
INSERT INTO categories (name, type, description, img_name)
VALUES 
    ('Salary', 'Income', 'Debit', 'salary.png'),
    ('Investment', 'Income', 'Credit', 'investment.png'),
    ('Savings', 'Income', 'Credit', 'savings.png'),
    ('Freelance', 'Income', 'Credit', 'freelance.png'),
    ('Bonus', 'Income', 'Credit', 'bonus.png');
-- Seed data for Expense categories
INSERT INTO categories (name, type, description, img_name)
VALUES 
    ('Food', 'Expense', 'Cash', 'food.png'),
    ('Transport', 'Expense', 'Cash', 'transport.png'),
    ('Utilities', 'Expense', 'Cash', 'utilities.png'),
    ('Rent', 'Expense', 'Cash', 'rent.png'),
    ('Groceries', 'Expense', 'Cash', 'groceries.png'),
    ('Entertainment', 'Expense', 'Cash', 'entertainment.png'),
    ('Healthcare', 'Expense', 'Cash', 'healthcare.png'),
    ('Education', 'Expense', 'Cash', 'education.png'),
    ('Clothing', 'Expense', 'Cash', 'clothing.png'),
    ('Subscriptions', 'Expense', 'Cash', 'subscriptions.png'),
    ('Gifts', 'Expense', 'Cash', 'gifts.png'),
    ('Travel', 'Expense', 'Cash', 'travel.png'),
    ('Vacation', 'Expense', 'Cash', 'vacation.png'),
    ('Insurance', 'Expense', 'Cash', 'insurance.png'),
    ('Mobile Bill', 'Expense', 'Cash', 'mobile_bill.png'),
    ('Internet', 'Expense', 'Cash', 'internet.png'),
    ('Sports', 'Expense', 'Cash', 'sports.png');