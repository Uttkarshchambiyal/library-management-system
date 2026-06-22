-- ==========================================
-- LIBRARY MANAGEMENT SYSTEM DATABASE SCRIPT
-- ==========================================

DROP DATABASE IF EXISTS library_db;
CREATE DATABASE library_db;
USE library_db;

-- ------------------------------------------
-- 1. Create Tables
-- ------------------------------------------

CREATE TABLE publishers (
  publisher_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (publisher_id)
);

CREATE TABLE books (
  book_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  published_year INT DEFAULT NULL,
  total_copies INT NOT NULL,
  available_copies INT NOT NULL,
  publisher_id INT DEFAULT NULL,
  PRIMARY KEY (book_id),
  UNIQUE KEY (isbn),
  FOREIGN KEY (publisher_id) REFERENCES publishers (publisher_id) ON DELETE SET NULL
);

CREATE TABLE members (
  member_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  join_date DATE NOT NULL,
  PRIMARY KEY (member_id),
  UNIQUE KEY (email)
);

CREATE TABLE borrow_transactions (
  transaction_id INT NOT NULL AUTO_INCREMENT,
  book_id INT NOT NULL,
  member_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  status ENUM('Borrowed','Returned','Overdue') DEFAULT 'Borrowed',
  PRIMARY KEY (transaction_id),
  FOREIGN KEY (book_id) REFERENCES books (book_id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members (member_id) ON DELETE CASCADE
);

-- ------------------------------------------





-- ------------------------------------------
-- 3. Create Views
-- ------------------------------------------

-- View to easily see current active borrowers
CREATE VIEW current_borrowers AS 
SELECT 
  m.first_name, 
  m.last_name, 
  b.title, 
  bt.borrow_date, 
  bt.due_date 
FROM members m 
JOIN borrow_transactions bt ON m.member_id = bt.member_id 
JOIN books b ON bt.book_id = b.book_id 
WHERE bt.status = 'Borrowed' OR bt.status = 'Overdue';

-- View to generate an overdue books report
CREATE VIEW overdue_books_report AS 
SELECT 
  bt.transaction_id, 
  m.first_name, 
  m.last_name, 
  m.email, 
  b.title, 
  bt.due_date, 
  DATEDIFF(CURDATE(), bt.due_date) AS days_overdue 
FROM borrow_transactions bt 
JOIN members m ON bt.member_id = m.member_id 
JOIN books b ON bt.book_id = b.book_id 
WHERE bt.status = 'Overdue' OR (bt.status = 'Borrowed' AND bt.due_date < CURDATE());
