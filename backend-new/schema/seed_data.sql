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


-- Seed data for transactions
INSERT INTO transactions (user_id, amount, category, type, date, note, icon) 
VALUES
    (1, 200.0, 'Groceries', 'expense', '2025-02-11', 'Weekly grocery shopping', 'https://cdn-icons-png.flaticon.com/512/1261/1261163.png'),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-02-15', 'Dinner at a fancy restaurant', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 150.0, 'Dining Out Again', 'expense', '2025-02-15', 'Dinner at a fancy restaurant', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 150.0, 'Dining Out', 'expense', '2025-02-15', 'Lunch with friends', 'https://media.istockphoto.com/id/1267161539/vector/meal-breaks-vector-line-icon-simple-thin-line-icon-premium-quality-design-element.jpg?s=612x612&w=0&k=20&c=9RNCS0uQvtbUGXqnmK1slk2y4rOOkJlE8bJ2W2qW9tY='),
    (1, 100.0, 'Freelance Work', 'income', '2025-02-20', 'Payment for freelance project', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbwVefKlscDH1ffNFGLeWv9W0WUXWZgxwq4w&s'),
    (1, 50.0, 'Entertainment', 'expense', '2025-02-25', 'Movie night with family', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ1hdffCPv9apz2ovZydUT8VYCRg0GJU8Kw&s');