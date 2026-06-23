<div align="center">

# Library Management System

### Manage Books | Members | Borrow Records | Built with Node.js & MySQL

[![GitHub stars](https://img.shields.io/github/stars/Uttkarshchambiyal/library-management-system?style=for-the-badge&color=yellow&logo=github)](https://github.com/Uttkarshchambiyal/library-management-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Uttkarshchambiyal/library-management-system?style=for-the-badge&color=blue&logo=github)](https://github.com/Uttkarshchambiyal/library-management-system/network)
[![GitHub issues](https://img.shields.io/github/issues/Uttkarshchambiyal/library-management-system?style=for-the-badge&color=red&logo=github)](https://github.com/Uttkarshchambiyal/library-management-system/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

</div>

---

> A full-featured Library Management System with a Node.js/Express REST API backend, MySQL database, and a plain HTML/CSS/JavaScript frontend.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## Features

- View all books along with their publisher details
- Add new books and members
- Borrow books with automatic availability tracking
- View currently borrowed books
- View top 5 most popular (most borrowed) books
- Remove members from the system
- Relational MySQL database with foreign key constraints
- RESTful API backend served with Express.js

---

## Tech Stack

| Layer | Technology |
|------------|----------------------------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| DB Driver | mysql2 |
| Dev Tool | nodemon |

---

## Project Structure

```
library-management-system/
│
├── backend/
│   ├── server.js          # Express server & all API routes
│   ├── package.json       # Node dependencies (express, mysql2, cors)
│   └── package-lock.json
│
├── frontend/
│   ├── index.html         # Main UI
│   ├── app.js             # Frontend logic & API calls
│   └── style.css          # Styling
│
├── schema.sql             # Database & table definitions
├── data.sql               # Sample/seed data (multi-line INSERTs)
├── er_diagram.mmd         # ER diagram (Mermaid format)
├── Project_Report.md      # Project report
├── Queries.sql            # Related mandatory queries
├── Project_Report_Final.pdf
└── README.md
```

---

## Database Schema

Database: `library_db`

| Table | Key Columns |
|--------------------|-------------------------------------------------------------|
| `publishers` | `publisher_id`, `name`, `contact_email`, `phone` |
| `books` | `book_id`, `title`, `author`, `isbn`, `published_year`, `total_copies`, `available_copies`, `publisher_id` |
| `members` | `member_id`, `first_name`, `last_name`, `email`, `phone`, `join_date` |
| `borrow_transactions` | `transaction_id`, `book_id`, `member_id`, `borrow_date`, `due_date`, `return_date`, `status` |

See [`schema.sql`](schema.sql) for full table definitions and [`data.sql`](data.sql) for seed data.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------------------|------------------------------------|
| GET | `/api/books` | Get all books with publisher names |
| GET | `/api/members` | Get all members |
| GET | `/api/publishers` | Get all publishers |
| GET | `/api/borrowed` | Get currently borrowed books |
| GET | `/api/popular-books` | Get top 5 most borrowed books |
| POST | `/api/books` | Add a new book |
| POST | `/api/members` | Add a new member |
| POST | `/api/borrow` | Issue a book to a member |
| DELETE | `/api/members/:id` | Remove a member by ID |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MySQL](https://www.mysql.com/) (v8+)

### 1. Clone the repository

```bash
git clone https://github.com/Uttkarshchambiyal/library-management-system.git
cd library-management-system
```

### 2. Set up the database

Open MySQL and run:

```bash
mysql -u root -p < schema.sql
mysql -u root -p library_db < data.sql
```

### 3. Configure the backend

In `backend/server.js`, update the DB credentials if needed:

```js
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'library_db',
});
```

### 4. Start the backend server

```bash
cd backend
npm install
npm start
# or for development:
npm run dev
```

The server runs on `http://localhost:3000` by default.

### 5. Open the frontend

Open `frontend/index.html` directly in your browser, or serve it with any static file server.

---

## Screenshots

> Add your screenshots inside an `assets/` folder and link them below.

| Main Menu | Book Management | Borrow Record |
|-----------|----------------|---------------|
| ![main](assets/main) | ![books](assets/books) | ![borrow](assets/borrow) |

---

## Contributing

Contributions are always welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add some AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
Made with by Uttkarsh & Sahil
</div>
