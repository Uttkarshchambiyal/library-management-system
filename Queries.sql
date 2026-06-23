--Suppose you want to add an address column to the members table.

ALTER TABLE members
ADD address VARCHAR(255);

--Find books that are currently borrowed.

SELECT title, author
FROM books
WHERE book_id IN (
    SELECT book_id
    FROM borrow_transactions
    WHERE status = 'Borrowed'
);

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

--Find members who have borrowed more than 2 books.

SELECT 
    member_id,
    COUNT(*) AS books_borrowed
FROM borrow_transactions
GROUP BY member_id
HAVING COUNT(*) > 2;

--Display member names along with the books they have borrowed.

SELECT 
    m.first_name,
    m.last_name,
    b.title,
    bt.borrow_date,
    bt.due_date
FROM members m
INNER JOIN borrow_transactions bt
    ON m.member_id = bt.member_id
INNER JOIN books b
    ON bt.book_id = b.book_id;
