// ============================================================
// app.js – Express REST API for Books
// ============================================================
// Lab 03: REST API, Query Parameters, Validation, and Debugging
// Course : Backend Development Fundamentals
// Student: Naga Manikanta Addaguri (252U1R9001)
// ============================================================

const express = require('express');
const { dbRun, dbGet, dbAll, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware
// ============================================================
// express.json() parses incoming JSON request bodies so we can
// access req.body in POST and PUT routes.
app.use(express.json());

// ============================================================
// Validation Helpers
// ============================================================
// Reusable functions that keep our route handlers clean.
// Called by POST /books and PUT /books/:id.
// ============================================================

/**
 * Validate the :id URL parameter.
 * A valid id is a positive integer like 1, 2, 3 …
 * Returns the parsed integer, or null if invalid.
 */
function parseId(rawId) {
  const id = Number(rawId);
  // Check: is it a finite integer greater than zero?
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

/**
 * Validate the request body for creating or updating a book.
 * Returns an array of error messages. An empty array means "all good".
 */
function validateBookBody(body) {
  const errors = [];

  // --- title ---
  if (body.title === undefined || body.title === null) {
    errors.push('Title is required');
  } else if (typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('Title must be a non-empty string');
  }

  // --- author ---
  if (body.author === undefined || body.author === null) {
    errors.push('Author is required');
  } else if (typeof body.author !== 'string' || body.author.trim() === '') {
    errors.push('Author must be a non-empty string');
  }

  // --- price ---
  if (body.price === undefined || body.price === null) {
    errors.push('Price is required');
  } else if (typeof body.price !== 'number' || isNaN(body.price)) {
    errors.push('Price must be a number');
  } else if (body.price < 0) {
    errors.push('Price must not be negative');
  }

  // --- pages (optional) ---
  if (body.pages !== undefined && body.pages !== null) {
    if (!Number.isInteger(body.pages) || body.pages <= 0) {
      errors.push('Pages must be a positive integer');
    }
  }

  return errors;
}

// ============================================================
// Routes
// ============================================================

// ---------- GET / – Welcome & endpoint listing ----------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Books REST API – Lab 03',
    student: 'Naga Manikanta Addaguri (252U1R9001)',
    endpoints: {
      'GET    /':           'This welcome message',
      'GET    /books':      'List all books (supports search, sort, filter, pagination)',
      'GET    /books/:id':  'Get a single book by ID',
      'POST   /books':      'Create a new book',
      'PUT    /books/:id':  'Update an existing book',
      'DELETE /books/:id':  'Delete a book',
    },
  });
});

// ---------- GET /books – List with query parameters ----------
app.get('/books', async (req, res) => {
  try {
    const { search_q, order_by, order, limit, offset, min_price, max_price } = req.query;

    // ---- Validate order_by (allowlist) ----
    // SQL column names CANNOT be parameterized with ?, so we compare
    // against an explicit list of safe column names.
    const ALLOWED_COLUMNS = ['id', 'title', 'author', 'price', 'pages'];
    let sortColumn = 'id'; // default

    if (order_by !== undefined) {
      if (ALLOWED_COLUMNS.includes(order_by)) {
        sortColumn = order_by;
      } else {
        return res.status(400).json({
          message: `Invalid order_by value. Allowed: ${ALLOWED_COLUMNS.join(', ')}`,
        });
      }
    }

    // ---- Validate order direction ----
    let sortOrder = 'ASC'; // default
    if (order !== undefined) {
      const upper = order.toUpperCase();
      if (upper === 'ASC' || upper === 'DESC') {
        sortOrder = upper;
      } else {
        return res.status(400).json({
          message: 'Invalid order value. Allowed: ASC, DESC',
        });
      }
    }

    // ---- Validate limit ----
    let limitVal = 10; // default
    if (limit !== undefined) {
      limitVal = parseInt(limit, 10);
      if (isNaN(limitVal) || limitVal <= 0) {
        return res.status(400).json({ message: 'Limit must be a positive integer' });
      }
    }

    // ---- Validate offset ----
    let offsetVal = 0; // default
    if (offset !== undefined) {
      offsetVal = parseInt(offset, 10);
      if (isNaN(offsetVal) || offsetVal < 0) {
        return res.status(400).json({ message: 'Offset must be a non-negative integer' });
      }
    }

    // ---- Build the SQL query dynamically ----
    // We start with SELECT * FROM books and add WHERE / ORDER BY / LIMIT
    // clauses based on the query parameters the client sent.
    let sql = 'SELECT * FROM books';
    const conditions = []; // WHERE parts
    const params = [];     // corresponding ? values

    // search_q → partial title match with LIKE
    if (search_q !== undefined && search_q.trim() !== '') {
      conditions.push('title LIKE ?');
      params.push(`%${search_q}%`);
    }

    // min_price filter
    if (min_price !== undefined) {
      const minP = parseFloat(min_price);
      if (isNaN(minP)) {
        return res.status(400).json({ message: 'min_price must be a number' });
      }
      conditions.push('price >= ?');
      params.push(minP);
    }

    // max_price filter
    if (max_price !== undefined) {
      const maxP = parseFloat(max_price);
      if (isNaN(maxP)) {
        return res.status(400).json({ message: 'max_price must be a number' });
      }
      conditions.push('price <= ?');
      params.push(maxP);
    }

    // Assemble WHERE clause
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // ORDER BY – sortColumn is validated against the allowlist above,
    // so it is safe to interpolate directly into the SQL string.
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

    // LIMIT and OFFSET – these are numbers, passed as parameters.
    sql += ' LIMIT ? OFFSET ?';
    params.push(limitVal, offsetVal);

    const books = await dbAll(sql, params);

    res.status(200).json({
      message: 'Books retrieved successfully',
      count: books.length,
      books,
    });
  } catch (error) {
    console.error('GET /books error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- GET /books/:id – Get one book ----------
app.get('/books/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid book ID. Must be a positive integer.' });
    }

    const book = await dbGet('SELECT * FROM books WHERE id = ?', [id]);

    if (!book) {
      return res.status(404).json({ message: `Book with ID ${id} not found` });
    }

    res.status(200).json({ message: 'Book retrieved successfully', book });
  } catch (error) {
    console.error('GET /books/:id error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- POST /books – Create a new book ----------
app.post('/books', async (req, res) => {
  try {
    // Validate request body
    const errors = validateBookBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
      // We return the first error as the main message (matches the
      // assignment's single-message format) and include the full
      // list in `errors` for convenience.
    }

    const { title, author, price, pages } = req.body;

    const result = await dbRun(
      'INSERT INTO books (title, author, price, pages) VALUES (?, ?, ?, ?)',
      [title.trim(), author.trim(), price, pages || null]
    );

    // Fetch the newly created book to return it
    const newBook = await dbGet('SELECT * FROM books WHERE id = ?', [result.lastID]);

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook,
    });
  } catch (error) {
    console.error('POST /books error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- PUT /books/:id – Update a book ----------
app.put('/books/:id', async (req, res) => {
  try {
    // Validate ID
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid book ID. Must be a positive integer.' });
    }

    // Validate request body
    const errors = validateBookBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    // Check if the book exists
    const existing = await dbGet('SELECT * FROM books WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: `Book with ID ${id} not found` });
    }

    const { title, author, price, pages } = req.body;

    await dbRun(
      'UPDATE books SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?',
      [title.trim(), author.trim(), price, pages || null, id]
    );

    // Fetch and return the updated book
    const updatedBook = await dbGet('SELECT * FROM books WHERE id = ?', [id]);

    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    console.error('PUT /books/:id error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- DELETE /books/:id – Delete a book ----------
app.delete('/books/:id', async (req, res) => {
  try {
    // Validate ID
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid book ID. Must be a positive integer.' });
    }

    // Check if the book exists
    const existing = await dbGet('SELECT * FROM books WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: `Book with ID ${id} not found` });
    }

    await dbRun('DELETE FROM books WHERE id = ?', [id]);

    res.status(200).json({
      message: 'Book deleted successfully',
      book: existing,
    });
  } catch (error) {
    console.error('DELETE /books/:id error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============================================================
// 404 handler – catches any route we haven't defined
// ============================================================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ============================================================
// Global error handler – catches unexpected errors
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ============================================================
// Start the Server
// ============================================================
// 1. Initialize the database (create table + seed if needed).
// 2. Then start listening for HTTP requests.
// Listening on 0.0.0.0 so Render (cloud hosting) can reach us.
// ============================================================

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 ============================================');
      console.log(`🚀  Books REST API is running!`);
      console.log(`🚀  Local:  http://localhost:${PORT}`);
      console.log('🚀  Press Ctrl+C to stop the server');
      console.log('🚀 ============================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1); // Stop the process if the database can't initialize
  }
}

startServer();

