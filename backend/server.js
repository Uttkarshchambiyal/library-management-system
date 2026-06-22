const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin@123',
    database: 'library_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database successfully using connection pool.');
    connection.release();
});

// API Routes

// 1. Get all books with their publishers
app.get('/api/books', (req, res) => {
    const query = `
        SELECT b.Book_id, b.Title, b.Author, b.Price, b.Available, p.Name AS publisher_name 
        FROM Books b
        LEFT JOIN Publisher p ON b.Pub_ID = p.Pub_ID
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Get all members
app.get('/api/members', (req, res) => {
    const query = 'SELECT * FROM Member';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2.5 Get most popular books
app.get('/api/popular-books', (req, res) => {
    const query = `
        SELECT b.Title, COUNT(bt.Book_id) as borrow_count
        FROM Books b
        LEFT JOIN Borrow_Transactions bt ON b.Book_id = bt.Book_id
        GROUP BY b.Book_id
        ORDER BY borrow_count DESC
        LIMIT 5;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Get currently borrowed books (using the view we created)
app.get('/api/borrowed', (req, res) => {
    const query = 'SELECT * FROM Current_Borrows';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Issue a book
app.post('/api/borrow', (req, res) => {
    const { Book_id, Memb_id, Issue_date, Due_date } = req.body;

    db.query('SELECT Available FROM Books WHERE Book_id = ?', [Book_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Book not found' });

        const available = results[0].Available;
        if (available <= 0) return res.status(400).json({ error: 'Book is out of stock' });

        // Insert transaction
        const insertQuery = 'INSERT INTO Borrow_Transactions (Book_id, Memb_id, Issue_date, Due_date) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [Book_id, Memb_id, Issue_date, Due_date], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // Update book copies
            db.query('UPDATE Books SET Available = Available - 1 WHERE Book_id = ?', [Book_id], (err3) => {
                if (err3) return res.status(500).json({ error: err3.message });
                res.json({ message: 'Book issued successfully' });
            });
        });
    });
});

// 5. Add a new member
app.post('/api/members', (req, res) => {
    const { Name, Address, Memb_type } = req.body;
    const Memb_date = new Date().toISOString().split('T')[0];
    
    // Automatically set expiry to 1 year from join date
    let expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const Expiry_date = expiryDate.toISOString().split('T')[0];
    
    const query = 'INSERT INTO Member (Name, Address, Memb_type, Memb_date, Expiry_date) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Name, Address, Memb_type, Memb_date, Expiry_date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Member added successfully!' });
    });
});

// 6. Delete a member
app.delete('/api/members/:id', (req, res) => {
    const Memb_id = req.params.id;
    const query = 'DELETE FROM Member WHERE Memb_id = ?';
    db.query(query, [Memb_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Member deleted successfully' });
    });
});

// 7. Get all publishers
app.get('/api/publishers', (req, res) => {
    const query = 'SELECT * FROM Publisher';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 8. Add a new book
app.post('/api/books', (req, res) => {
    const { Title, Author, Price, Available, Pub_ID } = req.body;
    
    const query = 'INSERT INTO Books (Title, Author, Price, Available, Pub_ID) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Title, Author, Price, Available, Pub_ID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book added successfully!' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
