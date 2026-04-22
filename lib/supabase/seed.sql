-- Word Problem Coach - Sample Problems Seed
-- Run after schema.sql in Supabase SQL Editor

-- ============================================
-- GRADE 3-5 PROBLEMS (Elementary)
-- ============================================

-- Grade 3-5: Addition/Subtraction
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440001', '3-5', 'Addition & Subtraction',
'Maria has 23 stickers. She buys 15 more stickers at the store. Then she gives 8 stickers to her friend. How many stickers does Maria have now?',
'[{"name": "initial_stickers", "value": 23, "unit": "stickers"}, {"name": "bought_stickers", "value": 15, "unit": "stickers"}, {"name": "given_stickers", "value": 8, "unit": "stickers"}]',
'final_stickers',
ARRAY['addition', 'subtraction'],
'23 + 15 - 8 = x',
'[{"step": 1, "description": "Start with 23 stickers", "math": "23"}, {"step": 2, "description": "Add 15 more stickers", "math": "23 + 15 = 38"}, {"step": 3, "description": "Subtract 8 given away", "math": "38 - 8 = 30"}, {"step": 4, "description": "Maria has 30 stickers", "math": "x = 30"}]',
'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400',
1);

-- Grade 3-5: Multiplication
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440002', '3-5', 'Multiplication',
'A box contains 6 pencils. There are 4 boxes. How many pencils are there in total?',
'[{"name": "pencils_per_box", "value": 6, "unit": "pencils"}, {"name": "number_of_boxes", "value": 4, "unit": "boxes"}]',
'total_pencils',
ARRAY['multiplication'],
'6 × 4 = x',
'[{"step": 1, "description": "6 pencils in each box", "math": "6"}, {"step": 2, "description": "4 boxes total", "math": "× 4"}, {"step": 3, "description": "Multiply to find total", "math": "6 × 4 = 24"}, {"step": 4, "description": "There are 24 pencils", "math": "x = 24"}]',
'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',
1);

-- Grade 3-5: Division
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440003', '3-5', 'Division',
'Emma has 35 cookies. She wants to share them equally among 5 friends. How many cookies does each friend get?',
'[{"name": "total_cookies", "value": 35, "unit": "cookies"}, {"name": "number_of_friends", "value": 5, "unit": "friends"}]',
'cookies_per_friend',
ARRAY['division'],
'35 ÷ 5 = x',
'[{"step": 1, "description": "35 cookies total", "math": "35"}, {"step": 2, "description": "Share among 5 friends", "math": "÷ 5"}, {"step": 3, "description": "Divide to find each share", "math": "35 ÷ 5 = 7"}, {"step": 4, "description": "Each friend gets 7 cookies", "math": "x = 7"}]',
'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
1);

-- Grade 3-5: Fractions
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440004', '3-5', 'Fractions',
'A pizza is cut into 8 equal slices. Jake eats 3 slices. What fraction of the pizza did Jake eat?',
'[{"name": "total_slices", "value": 8, "unit": "slices"}, {"name": "eaten_slices", "value": 3, "unit": "slices"}]',
'fraction_eaten',
ARRAY['fraction'],
'3/8 = x',
'[{"step": 1, "description": "Pizza has 8 equal slices", "math": "denominator = 8"}, {"step": 2, "description": "Jake ate 3 slices", "math": "numerator = 3"}, {"step": 3, "description": "Fraction is part over whole", "math": "3/8"}, {"step": 4, "description": "Jake ate 3/8 of the pizza", "math": "x = 3/8"}]',
'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
2);

-- Grade 3-5: Multi-step
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440005', '3-5', 'Multi-step',
'Tom has $50. He buys 3 books that cost $8 each. How much money does Tom have left?',
'[{"name": "initial_money", "value": 50, "unit": "dollars"}, {"name": "books_bought", "value": 3, "unit": "books"}, {"name": "cost_per_book", "value": 8, "unit": "dollars"}]',
'remaining_money',
ARRAY['multiplication', 'subtraction'],
'50 - (3 × 8) = x',
'[{"step": 1, "description": "Find total cost of books", "math": "3 × $8 = $24"}, {"step": 2, "description": "Subtract from initial money", "math": "$50 - $24"}, {"step": 3, "description": "Calculate remaining", "math": "$50 - $24 = $26"}, {"step": 4, "description": "Tom has $26 left", "math": "x = 26"}]',
'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
3);

-- ============================================
-- GRADE 6-8 PROBLEMS (Middle School)
-- ============================================

-- Grade 6-8: Ratios
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440006', '6-8', 'Ratios',
'The ratio of boys to girls in a class is 3:4. There are 21 boys in the class. How many students are there in total?',
'[{"name": "ratio_boys", "value": 3, "unit": "parts"}, {"name": "ratio_girls", "value": 4, "unit": "parts"}, {"name": "actual_boys", "value": 21, "unit": "students"}]',
'total_students',
ARRAY['ratio', 'multiplication', 'addition'],
'21 ÷ 3 = 7 (multiplier), (3 + 4) × 7 = x',
'[{"step": 1, "description": "Find the multiplier", "math": "21 ÷ 3 = 7"}, {"step": 2, "description": "Total ratio parts", "math": "3 + 4 = 7 parts"}, {"step": 3, "description": "Multiply by multiplier", "math": "7 × 7 = 49"}, {"step": 4, "description": "There are 49 students total", "math": "x = 49"}]',
'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
3);

-- Grade 6-8: Percentages
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440007', '6-8', 'Percentages',
'A shirt originally costs $45. It is on sale for 20% off. What is the sale price?',
'[{"name": "original_price", "value": 45, "unit": "dollars"}, {"name": "discount_percent", "value": 20, "unit": "percent"}]',
'sale_price',
ARRAY['percentage', 'subtraction'],
'45 - (45 × 0.20) = x',
'[{"step": 1, "description": "Calculate discount amount", "math": "$45 × 0.20 = $9"}, {"step": 2, "description": "Subtract discount from original", "math": "$45 - $9"}, {"step": 3, "description": "Sale price", "math": "$45 - $9 = $36"}, {"step": 4, "description": "The sale price is $36", "math": "x = 36"}]',
'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
2);

-- Grade 6-8: Rates
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440008', '6-8', 'Rates',
'A car travels 240 miles in 4 hours. At this rate, how far will it travel in 7 hours?',
'[{"name": "distance_1", "value": 240, "unit": "miles"}, {"name": "time_1", "value": 4, "unit": "hours"}, {"name": "time_2", "value": 7, "unit": "hours"}]',
'distance_2',
ARRAY['rate', 'multiplication'],
'(240 ÷ 4) × 7 = x',
'[{"step": 1, "description": "Find the rate (speed)", "math": "240 ÷ 4 = 60 mph"}, {"step": 2, "description": "Multiply rate by new time", "math": "60 × 7"}, {"step": 3, "description": "Calculate distance", "math": "60 × 7 = 420"}, {"step": 4, "description": "The car will travel 420 miles", "math": "x = 420"}]',
'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
3);

-- Grade 6-8: Equations
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440009', '6-8', 'Linear Equations',
'Three times a number plus 7 equals 34. What is the number?',
'[{"name": "multiplier", "value": 3, "unit": "times"}, {"name": "constant", "value": 7, "unit": ""}, {"name": "result", "value": 34, "unit": ""}]',
'unknown_number',
ARRAY['algebra', 'subtraction', 'division'],
'3x + 7 = 34',
'[{"step": 1, "description": "Write the equation", "math": "3x + 7 = 34"}, {"step": 2, "description": "Subtract 7 from both sides", "math": "3x = 27"}, {"step": 3, "description": "Divide by 3", "math": "x = 9"}, {"step": 4, "description": "The number is 9", "math": "x = 9"}]',
'https://images.unsplash.com/photo-1596495578065-6e9b34a11827?w=400',
3);

-- Grade 6-8: Proportions
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440010', '6-8', 'Proportions',
'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 8 cups of flour, how many cups of sugar do you need?',
'[{"name": "flour_ratio", "value": 2, "unit": "cups"}, {"name": "sugar_ratio", "value": 3, "unit": "cups"}, {"name": "flour_used", "value": 8, "unit": "cups"}]',
'sugar_needed',
ARRAY['proportion', 'multiplication'],
'2/3 = 8/x',
'[{"step": 1, "description": "Set up the proportion", "math": "2/3 = 8/x"}, {"step": 2, "description": "Cross multiply", "math": "2x = 24"}, {"step": 3, "description": "Solve for x", "math": "x = 12"}, {"step": 4, "description": "You need 12 cups of sugar", "math": "x = 12"}]',
'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=400',
3);

-- ============================================
-- ALGEBRA 1 PROBLEMS (High School)
-- ============================================

-- Algebra 1: Linear Equations
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440011', 'algebra-1', 'Linear Equations',
'A phone plan costs $25 per month plus $0.10 per text message. If your bill was $37.50 last month, how many text messages did you send?',
'[{"name": "base_cost", "value": 25, "unit": "dollars"}, {"name": "cost_per_text", "value": 0.10, "unit": "dollars"}, {"name": "total_bill", "value": 37.50, "unit": "dollars"}]',
'number_of_texts',
ARRAY['algebra', 'subtraction', 'division'],
'25 + 0.10x = 37.50',
'[{"step": 1, "description": "Write the equation", "math": "25 + 0.10x = 37.50"}, {"step": 2, "description": "Subtract 25 from both sides", "math": "0.10x = 12.50"}, {"step": 3, "description": "Divide by 0.10", "math": "x = 125"}, {"step": 4, "description": "You sent 125 text messages", "math": "x = 125"}]',
'https://images.unsplash.com/photo-1512428559087-560fa5ce7d25?w=400',
3);

-- Algebra 1: Systems of Equations
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440012', 'algebra-1', 'Systems of Equations',
'The sum of two numbers is 45. The difference between the two numbers is 15. What are the two numbers?',
'[{"name": "sum", "value": 45, "unit": ""}, {"name": "difference", "value": 15, "unit": ""}]',
'both_numbers',
ARRAY['algebra', 'addition', 'subtraction'],
'x + y = 45, x - y = 15',
'[{"step": 1, "description": "Set up the system", "math": "x + y = 45, x - y = 15"}, {"step": 2, "description": "Add the equations", "math": "2x = 60"}, {"step": 3, "description": "Solve for x", "math": "x = 30"}, {"step": 4, "description": "Substitute to find y", "math": "30 + y = 45, y = 15"}, {"step": 5, "description": "The numbers are 30 and 15", "math": "x = 30, y = 15"}]',
'https://images.unsplash.com/photo-1509248961158-e54f04b4a45d?w=400',
4);

-- Algebra 1: Quadratic Equations
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440013', 'algebra-1', 'Quadratic Equations',
'A ball is thrown upward with an initial velocity of 48 feet per second from a height of 6 feet. The height h after t seconds is given by h = -16t² + 48t + 6. When does the ball reach its maximum height?',
'[{"name": "initial_velocity", "value": 48, "unit": "ft/s"}, {"name": "initial_height", "value": 6, "unit": "feet"}, {"name": "gravity_constant", "value": -16, "unit": "ft/s²"}]',
'time_to_max_height',
ARRAY['quadratic', 'vertex_formula'],
't = -b/(2a) = -48/(2×-16)',
'[{"step": 1, "description": "Identify a, b, c from the quadratic", "math": "a = -16, b = 48, c = 6"}, {"step": 2, "description": "Use vertex formula for t", "math": "t = -b/(2a)"}, {"step": 3, "description": "Substitute values", "math": "t = -48/(2×-16) = -48/-32"}, {"step": 4, "description": "Simplify", "math": "t = 1.5 seconds"}]',
'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
4);

-- Algebra 1: Inequalities
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440014', 'algebra-1', 'Inequalities',
'You have $100 to spend on video games. Each game costs $35. Write and solve an inequality to find the maximum number of games you can buy.',
'[{"name": "budget", "value": 100, "unit": "dollars"}, {"name": "cost_per_game", "value": 35, "unit": "dollars"}]',
'max_games',
ARRAY['inequality', 'division'],
'35x ≤ 100',
'[{"step": 1, "description": "Write the inequality", "math": "35x ≤ 100"}, {"step": 2, "description": "Divide both sides by 35", "math": "x ≤ 100/35"}, {"step": 3, "description": "Simplify", "math": "x ≤ 2.86"}, {"step": 4, "description": "Since you can only buy whole games, round down", "math": "x ≤ 2"}, {"step": 5, "description": "Maximum 2 games can be bought", "math": "x = 2"}]',
'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
3);

-- Algebra 1: Distance-Rate-Time
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440015', 'algebra-1', 'Distance-Rate-Time',
'Two trains leave the same station traveling in opposite directions. One train travels at 60 mph and the other at 75 mph. How long will it take for them to be 270 miles apart?',
'[{"name": "speed_train_1", "value": 60, "unit": "mph"}, {"name": "speed_train_2", "value": 75, "unit": "mph"}, {"name": "target_distance", "value": 270, "unit": "miles"}]',
'time_apart',
ARRAY['algebra', 'addition', 'division'],
'(60 + 75)t = 270',
'[{"step": 1, "description": "Combined rate when going opposite directions", "math": "60 + 75 = 135 mph"}, {"step": 2, "description": "Set up the equation", "math": "135t = 270"}, {"step": 3, "description": "Divide both sides by 135", "math": "t = 270/135"}, {"step": 4, "description": "Simplify", "math": "t = 2 hours"}]',
'https://images.unsplash.com/photo-1474487548413-87463b0d8b64?w=400',
4);

-- ============================================
-- Additional Grade 3-5 Problems
-- ============================================
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440016', '3-5', 'Addition & Subtraction',
'A library has 156 fiction books and 89 non-fiction books. 45 books are checked out. How many books are left in the library?',
'[{"name": "fiction_books", "value": 156, "unit": "books"}, {"name": "nonfiction_books", "value": 89, "unit": "books"}, {"name": "checked_out", "value": 45, "unit": "books"}]',
'remaining_books',
ARRAY['addition', 'subtraction'],
'(156 + 89) - 45 = x',
'[{"step": 1, "description": "Find total books", "math": "156 + 89 = 245"}, {"step": 2, "description": "Subtract checked out books", "math": "245 - 45 = 200"}, {"step": 3, "description": "Books remaining", "math": "x = 200"}]',
NULL, 2);

INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440017', '3-5', 'Multiplication',
'A classroom has 7 rows of desks. Each row has 5 desks. How many desks are in the classroom?',
'[{"name": "rows", "value": 7, "unit": "rows"}, {"name": "desks_per_row", "value": 5, "unit": "desks"}]',
'total_desks',
ARRAY['multiplication'],
'7 × 5 = x',
'[{"step": 1, "description": "Multiply rows by desks per row", "math": "7 × 5 = 35"}, {"step": 2, "description": "Total desks", "math": "x = 35"}]',
NULL, 1);

-- ============================================
-- Additional Grade 6-8 Problems
-- ============================================
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440018', '6-8', 'Percentages',
'A restaurant bill is $65. You want to leave a 18% tip. How much should you leave as a tip?',
'[{"name": "bill_amount", "value": 65, "unit": "dollars"}, {"name": "tip_percent", "value": 18, "unit": "percent"}]',
'tip_amount',
ARRAY['percentage', 'multiplication'],
'65 × 0.18 = x',
'[{"step": 1, "description": "Convert percent to decimal", "math": "18% = 0.18"}, {"step": 2, "description": "Multiply bill by tip rate", "math": "$65 × 0.18 = $11.70"}, {"step": 3, "description": "Tip amount", "math": "x = $11.70"}]',
NULL, 2);

INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440019', '6-8', 'Ratios',
'A paint mixture uses red and blue paint in a ratio of 2:5. If you need 35 liters of mixture total, how many liters of red paint do you need?',
'[{"name": "ratio_red", "value": 2, "unit": "parts"}, {"name": "ratio_blue", "value": 5, "unit": "parts"}, {"name": "total_mixture", "value": 35, "unit": "liters"}]',
'red_paint_liters',
ARRAY['ratio', 'division', 'multiplication'],
'2/(2+5) × 35 = x',
'[{"step": 1, "description": "Find total ratio parts", "math": "2 + 5 = 7 parts"}, {"step": 2, "description": "Find value of one part", "math": "35 ÷ 7 = 5 liters"}, {"step": 3, "description": "Calculate red paint", "math": "2 × 5 = 10 liters"}, {"step": 4, "description": "Red paint needed", "math": "x = 10"}]',
NULL, 3);

-- ============================================
-- Additional Algebra 1 Problems
-- ============================================
INSERT INTO problems (id, grade_band, topic, problem_text, quantities, unknown, operations, equation, solution_steps, difficulty)
VALUES
('550e8400-e29b-41d4-a716-446655440020', 'algebra-1', 'Linear Equations',
'A gym membership costs $30 to join plus $20 per month. Another gym has no joining fee but charges $25 per month. After how many months will the gyms cost the same?',
'[{"name": "gym1_join", "value": 30, "unit": "dollars"}, {"name": "gym1_monthly", "value": 20, "unit": "dollars"}, {"name": "gym2_monthly", "value": 25, "unit": "dollars"}]',
'months_equal',
ARRAY['algebra', 'subtraction', 'division'],
'30 + 20x = 25x',
'[{"step": 1, "description": "Set up equation", "math": "30 + 20x = 25x"}, {"step": 2, "description": "Subtract 20x from both sides", "math": "30 = 5x"}, {"step": 3, "description": "Divide by 5", "math": "x = 6"}, {"step": 4, "description": "Gyms cost the same after 6 months", "math": "x = 6"}]',
NULL, 4);
