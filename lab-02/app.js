const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "database.db");

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Database initialisation ──────────────────────────────────────────────────
/**
 * Opens (or creates) the SQLite database, creates the `book` table if it does
 * not already exist, and seeds nine sample rows when the table is empty.
 * Returns a Promise that resolves with the open db instance.
 */
function initDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
      console.log("Connected to SQLite database.");
    });

    db.serialize(() => {
      // Create table
      db.run(
        `CREATE TABLE IF NOT EXISTS book (
          id     INTEGER PRIMARY KEY AUTOINCREMENT,
          title  TEXT    NOT NULL,
          author TEXT    NOT NULL,
          price  INTEGER NOT NULL,
          pages  INTEGER NOT NULL
        )`,
        (err) => {
          if (err) return reject(err);
        }
      );

      // Seed only when the table is empty
      db.get("SELECT COUNT(*) AS cnt FROM book", (err, row) => {
        if (err) return reject(err);

        if (row.cnt === 0) {
          const sampleBooks = [
            ["The Pragmatic Programmer", "David Thomas", 499, 352],
            ["Clean Code", "Robert C. Martin", 450, 464],
            ["You Don't Know JS", "Kyle Simpson", 350, 278],
            ["JavaScript: The Good Parts", "Douglas Crockford", 299, 176],
            ["Eloquent JavaScript", "Marijn Haverbeke", 399, 472],
            ["Node.js Design Patterns", "Mario Casciaro", 549, 660],
            ["Learning Python", "Mark Lutz", 599, 1594],
            ["Introduction to Algorithms", "Thomas H. Cormen", 799, 1292],
            ["Design Patterns", "Erich Gamma", 649, 395],
          ];

          const stmt = db.prepare(
            "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)"
          );
          sampleBooks.forEach(([title, author, price, pages]) => {
            stmt.run(title, author, price, pages);
          });
          stmt.finalize(() => {
            console.log("Seeded 9 sample books.");
            resolve(db);
          });
        } else {
          resolve(db);
        }
      });
    });
  });
}

// ─── Helper: promisify db methods ─────────────────────────────────────────────
const dbAll = (db, sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

const dbGet = (db, sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  );

const dbRun = (db, sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    })
  );

// ─── Route factory ────────────────────────────────────────────────────────────
/**
 * Registers all five CRUD routes on the Express app using the open db instance.
 */
function registerRoutes(db) {
  // ── GET /books/ ─ Retrieve all books ────────────────────────────────────────
  app.get("/books/", async (req, res) => {
    try {
      const books = await dbAll(db, "SELECT * FROM book");
      res.status(200).json(books);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve books." });
    }
  });

  // ── GET /books/:bookId/ ─ Retrieve a specific book ──────────────────────────
  app.get("/books/:bookId/", async (req, res) => {
    try {
      const { bookId } = req.params;
      const book = await dbGet(db, "SELECT * FROM book WHERE id = ?", [bookId]);

      if (!book) {
        return res.status(404).json({ error: `Book with id ${bookId} not found.` });
      }
      res.status(200).json(book);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve book." });
    }
  });

  // ── POST /books/ ─ Add a new book ────────────────────────────────────────────
  app.post("/books/", async (req, res) => {
    try {
      const { title, author, price, pages } = req.body;

      // Validate required fields
      if (!title || !author || price === undefined || pages === undefined) {
        return res
          .status(400)
          .json({ error: "All fields (title, author, price, pages) are required." });
      }

      const result = await dbRun(
        db,
        "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
        [title, author, price, pages]
      );

      const newBook = await dbGet(db, "SELECT * FROM book WHERE id = ?", [result.lastID]);
      res.status(201).json(newBook);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add book." });
    }
  });

  // ── PUT /books/:bookId/ ─ Update an existing book ────────────────────────────
  app.put("/books/:bookId/", async (req, res) => {
    try {
      const { bookId } = req.params;

      // Check book exists
      const existing = await dbGet(db, "SELECT * FROM book WHERE id = ?", [bookId]);
      if (!existing) {
        return res.status(404).json({ error: `Book with id ${bookId} not found.` });
      }

      const { title, author, price, pages } = req.body;

      // Merge: use provided values or fall back to current values
      const updatedTitle  = title  !== undefined ? title  : existing.title;
      const updatedAuthor = author !== undefined ? author : existing.author;
      const updatedPrice  = price  !== undefined ? price  : existing.price;
      const updatedPages  = pages  !== undefined ? pages  : existing.pages;

      await dbRun(
        db,
        "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
        [updatedTitle, updatedAuthor, updatedPrice, updatedPages, bookId]
      );

      const updatedBook = await dbGet(db, "SELECT * FROM book WHERE id = ?", [bookId]);
      res.status(200).json(updatedBook);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update book." });
    }
  });

  // ── DELETE /books/:bookId/ ─ Delete a book ───────────────────────────────────
  app.delete("/books/:bookId/", async (req, res) => {
    try {
      const { bookId } = req.params;

      // Check book exists
      const existing = await dbGet(db, "SELECT * FROM book WHERE id = ?", [bookId]);
      if (!existing) {
        return res.status(404).json({ error: `Book with id ${bookId} not found.` });
      }

      await dbRun(db, "DELETE FROM book WHERE id = ?", [bookId]);
      res.status(200).json({ message: `Book with id ${bookId} deleted successfully.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete book." });
    }
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function startServer() {
  try {
    const db = await initDB();
    registerRoutes(db);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log("\nAvailable endpoints:");
      console.log("  GET    http://localhost:3000/books/");
      console.log("  GET    http://localhost:3000/books/:bookId/");
      console.log("  POST   http://localhost:3000/books/");
      console.log("  PUT    http://localhost:3000/books/:bookId/");
      console.log("  DELETE http://localhost:3000/books/:bookId/");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

