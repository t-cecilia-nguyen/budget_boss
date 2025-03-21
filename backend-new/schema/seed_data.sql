-- Seed data for Income categories
-- console.log('Seeding categories...');

-- INSERT INTO categories (user_id, name, type, description, img_name)
-- VALUES 
--     (1,'Salary', 'Income', 'Debit', 'salary.png'),
--     (1,'Investment', 'Income', 'Credit', 'investment.png'),
--     (1,'Savings', 'Income', 'Credit', 'savings.png'),
--     (1,'Freelance', 'Income', 'Credit', 'freelance.png'),
--     (1,'Bonus', 'Income', 'Credit', 'bonus.png'),
--     (1,'Food', 'Expense', 'Cash', 'food.png'),
--     (1,'Transport', 'Expense', 'Cash', 'transport.png'),
--     (1,'Utilities', 'Expense', 'Cash', 'utilities.png'),
--     (1,'Rent', 'Expense', 'Cash', 'rent.png'),
--     (1,'Groceries', 'Expense', 'Cash', 'groceries.png'),
--     (1,'Entertainment', 'Expense', 'Cash', 'entertainment.png'),
--     (1,'Healthcare', 'Expense', 'Cash', 'healthcare.png'),
--     (1,'Education', 'Expense', 'Cash', 'education.png'),
--     (1,'Clothing', 'Expense', 'Cash', 'clothing.png'),
--     (1,'Subscriptions', 'Expense', 'Cash', 'subscriptions.png'),
--     (1,'Gifts', 'Expense', 'Cash', 'gifts.png'),
--     (1,'Travel', 'Expense', 'Cash', 'travel.png'),
--     (1,'Vacation', 'Expense', 'Cash', 'vacation.png'),
--     (1,'Insurance', 'Expense', 'Cash', 'insurance.png'),
--     (1,'Mobile Bill', 'Expense', 'Cash', 'mobile.png'),
--     (1,'Internet', 'Expense', 'Cash', 'internet.png'),
--     (1,'Sports', 'Expense', 'Cash', 'sports.png');

-- Seed data for February (Low Balance)
INSERT INTO transactions (user_id, amount, category, type, date, note, icon) 
VALUES
    (1, 1800.0, 'Rent', 'expense', '2025-02-01', 'Monthly rent payment', 'rent.png'),
    (1, 150.0, 'Groceries', 'expense', '2025-02-05', 'Weekly grocery shopping', 'groceries.png'),
    (1, 100.0, 'Dining Out', 'expense', '2025-02-10', 'Lunch at a restaurant', 'food.png'),
    (1, 75.0, 'Transport', 'expense', '2025-02-12', 'Gas and public transport fees', 'transport.png'),
    (1, 50.0, 'Subscriptions', 'expense', '2025-02-15', 'Streaming services and memberships', 'subscriptions.png'),
    (1, 120.0, 'Utilities', 'expense', '2025-02-20', 'Electricity and water bills', 'utilities.png'),
    (1, 2500.0, 'Salary', 'income', '2025-02-28', 'Monthly salary deposit', 'salary.png');

-- Seed data for March (Surplus)
INSERT INTO transactions (user_id, amount, category, type, date, note, icon) 
VALUES
    (1, 2500.0, 'Salary', 'income', '2025-03-01', 'Monthly salary deposit', 'salary.png'),
    (1, 500.0, 'Freelance Work', 'income', '2025-03-05', 'Extra payment for project', 'freelance.png'),
    (1, 300.0, 'Investment', 'income', '2025-03-10', 'Investment returns', 'investment.png'),
    (1, 100.0, 'Savings', 'income', '2025-03-15', 'Interest earned on savings', 'savings.png'),
    (1, 200.0, 'Groceries', 'expense', '2025-03-05', 'Stocking up groceries', 'groceries.png'),
    (1, 150.0, 'Dining Out', 'expense', '2025-03-12', 'Dinner with family', 'food.png'),
    (1, 100.0, 'Entertainment', 'expense', '2025-03-18', 'Movie night and games', 'entertainment.png');

-- Seed data for April (Negative)
INSERT INTO transactions (user_id, amount, category, type, date, note, icon) 
VALUES
    (1, 200.0, 'Groceries', 'expense', '2025-04-11', 'Weekly grocery shopping', 'groceries.png'),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-04-15', 'Dinner at a fancy restaurant', 'food.png'),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-04-15', 'Dinner at a fancy restaurant', 'food.png'),
    (1, 150.0, 'Dining Out', 'expense', '2025-04-15', 'Lunch with friends', 'food.png'),
    (1, 100.0, 'Freelance Work', 'income', '2025-04-20', 'Payment for freelance project', 'freelance.png'),
    (1, 50.0, 'Entertainment', 'expense', '2025-04-25', 'Movie night with family', 'entertainment.png');