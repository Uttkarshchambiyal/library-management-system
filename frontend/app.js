const API_URL = 'http://localhost:3000/api';

// ==========================================
// Fetch and Render Functions
// ==========================================

// Fetch all books
async function fetchBooks() {
    try {
        const res = await fetch(`${API_URL}/books`);
        const books = await res.json();
        const tbody = document.querySelector('#books-table tbody');
        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">No books found.</td></tr>';
            return;
        }
        tbody.innerHTML = books.map(b => `
            <tr>
                <td>${b.Book_id}</td>
                <td>${b.Title}</td>
                <td>${b.Author}</td>
                <td>₹${parseFloat(b.Price).toFixed(2)}</td>
                <td>${b.Available}</td>
                <td>${b.publisher_name || 'N/A'}</td>
            </tr>
        `).join('');

        // Also populate the book dropdown in the Issue form
        const bookSelect = document.getElementById('book-id');
        bookSelect.innerHTML = '<option value="">-- Choose a Book --</option>';
        books.forEach(b => {
            if (b.Available > 0) {
                bookSelect.innerHTML += `<option value="${b.Book_id}">${b.Title} (Avail: ${b.Available})</option>`;
            }
        });
    } catch (err) {
        console.error('Error fetching books:', err);
    }
}

// Fetch all members
async function fetchMembers() {
    try {
        const res = await fetch(`${API_URL}/members`);
        const members = await res.json();
        const tbody = document.querySelector('#members-table tbody');
        if (members.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No members found.</td></tr>';
            return;
        }
        tbody.innerHTML = members.map(m => `
            <tr>
                <td>${m.Memb_id}</td>
                <td>${m.Name}</td>
                <td>${m.Address || 'N/A'}</td>
                <td>${m.Memb_type || 'N/A'}</td>
                <td>${m.Memb_date ? new Date(m.Memb_date).toLocaleDateString() : 'N/A'}</td>
                <td>${m.Expiry_date ? new Date(m.Expiry_date).toLocaleDateString() : 'N/A'}</td>
                <td><button class="btn-danger" onclick="deleteMember(${m.Memb_id})">Delete</button></td>
            </tr>
        `).join('');

        // Also populate the member dropdown in the Issue form
        const memberSelect = document.getElementById('member-id');
        memberSelect.innerHTML = '<option value="">-- Choose a Member --</option>';
        members.forEach(m => {
            memberSelect.innerHTML += `<option value="${m.Memb_id}">${m.Name} (${m.Memb_type || 'N/A'})</option>`;
        });
    } catch (err) {
        console.error('Error fetching members:', err);
    }
}

// Fetch currently borrowed books
async function fetchBorrowed() {
    try {
        const res = await fetch(`${API_URL}/borrowed`);
        const borrowed = await res.json();
        const tbody = document.querySelector('#borrowed-table tbody');
        if (borrowed.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="loading">No books currently borrowed.</td></tr>';
            return;
        }
        tbody.innerHTML = borrowed.map(b => `
            <tr>
                <td>${b.Member_Name}</td>
                <td>${b.Book_Title}</td>
                <td>${new Date(b.Issue_date).toLocaleDateString()}</td>
                <td>${new Date(b.Due_date).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error fetching borrowed:', err);
    }
}

// Fetch most popular books
async function fetchPopularBooks() {
    try {
        const res = await fetch(`${API_URL}/popular-books`);
        const popular = await res.json();
        const tbody = document.querySelector('#popular-table tbody');
        if (popular.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="loading">No data yet.</td></tr>';
            return;
        }
        tbody.innerHTML = popular.map(p => `
            <tr>
                <td>${p.Title}</td>
                <td>${p.borrow_count}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error fetching popular books:', err);
    }
}

// Fetch publishers and populate the Add Book form dropdown
async function fetchPublishers() {
    try {
        const res = await fetch(`${API_URL}/publishers`);
        const publishers = await res.json();
        const pubSelect = document.getElementById('book-publisher');
        pubSelect.innerHTML = '<option value="">-- Choose a Publisher --</option>';
        publishers.forEach(p => {
            pubSelect.innerHTML += `<option value="${p.Pub_ID}">${p.Name}</option>`;
        });
    } catch (err) {
        console.error('Error fetching publishers:', err);
    }
}

// ==========================================
// Action Functions
// ==========================================

// Delete a member
async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
        const res = await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert(data.message);
        fetchMembers();
        fetchBorrowed();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ==========================================
// Form Submissions
// ==========================================

// Issue a book
document.getElementById('issue-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgDiv = document.getElementById('form-message');
    const body = {
        Book_id: parseInt(document.getElementById('book-id').value),
        Memb_id: parseInt(document.getElementById('member-id').value),
        Issue_date: document.getElementById('issue-date').value,
        Due_date: document.getElementById('due-date').value,
    };
    try {
        const res = await fetch(`${API_URL}/borrow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        msgDiv.textContent = data.message;
        msgDiv.className = 'success';
        e.target.reset();
        fetchBooks();
        fetchBorrowed();
        fetchPopularBooks();
    } catch (err) {
        msgDiv.textContent = 'Error: ' + err.message;
        msgDiv.className = 'error';
    }
});

// Add a new member
document.getElementById('add-member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgDiv = document.getElementById('member-message');
    const body = {
        Name: document.getElementById('member-name').value,
        Address: document.getElementById('member-address').value,
        Memb_type: document.getElementById('member-type').value,
    };
    try {
        const res = await fetch(`${API_URL}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        msgDiv.textContent = data.message;
        msgDiv.className = 'success';
        e.target.reset();
        fetchMembers();
    } catch (err) {
        msgDiv.textContent = 'Error: ' + err.message;
        msgDiv.className = 'error';
    }
});

// Add a new book
document.getElementById('add-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgDiv = document.getElementById('add-book-message');
    const body = {
        Title: document.getElementById('book-title').value,
        Author: document.getElementById('book-author').value,
        Price: parseFloat(document.getElementById('book-price').value),
        Available: parseInt(document.getElementById('book-available').value),
        Pub_ID: parseInt(document.getElementById('book-publisher').value),
    };
    try {
        const res = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        msgDiv.textContent = data.message;
        msgDiv.className = 'success';
        e.target.reset();
        fetchBooks();
    } catch (err) {
        msgDiv.textContent = 'Error: ' + err.message;
        msgDiv.className = 'error';
    }
});

// ==========================================
// Initialize on page load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    fetchMembers();
    fetchBorrowed();
    fetchPopularBooks();
    fetchPublishers();
});
