
ALTER TABLE members
ADD address VARCHAR(255);

SELECT title, author
FROM books
WHERE book_id IN (
    SELECT book_id
    FROM borrow_transactions
    WHERE status = 'Borrowed'
);

