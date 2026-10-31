# Lab 2: SQLite Database and CRUD Routes Using Node.js and Express

---

## Student Details

| Field                   | Details                                      |
|-------------------------|----------------------------------------------|
| **Student Name**        | Naga Manikanta Addaguri                      |
| **Registration Number** | N25H03A1334                                  |
| **Course**              | CSE â€“ Gen AI                                 |
| **College**             | NIAT                                         |

---

## Project Overview

This project implements a complete, production-grade RESTful API backend using **Node.js** and **Express.js** connected to an **SQLite** relational database engine. The service provides full **CRUD** (Create, Read, Update, Delete) capabilities to manage a collection of technical books. 

The application is structured to ensure reliability, security, and clean separation of concerns:
- **Asynchronous Flow:** Fully utilizes ES6+ `async/await` patterns with promisified database operations.
- **SQL Injection Prevention:** Uses parameterized queries (`?` placeholders) across all SQL execution blocks.
- **Robust Error Handling:** Comprehensive status code reporting (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`).
- **Automated Lifecycle:** Database file creation, schema initialization, and realistic sample data seeding are completely automated upon startup.

---

## Objectives

1. Design and configure an Express.js web server running on Node.js.
2. Initialize and maintain a file-based SQLite database (`database.db`) using the `sqlite3` driver.
3. Define the relational schema for the `book` table with primary keys and data integrity constraints.
4. Implement five core CRUD endpoints following REST architectural conventions.
5. Apply SQL parameterized queries to eliminate SQL injection vulnerabilities.
6. Verify and document all HTTP request/response payloads and status codes via Postman.
7. Inspect the underlying database table directly using DB Browser for SQLite.

---

## Theoretical Concepts & Technology Stack

### 1. Node.js
Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. It operates on a single-threaded, non-blocking, event-driven I/O model, making it exceptionally lightweight and efficient for building high-throughput, data-intensive distributed network applications.

### 2. Express.js
Express.js is the de facto standard web application framework for Node.js. It offers a minimalist, flexible layer of core web application features, including sophisticated routing algorithms, middleware pipelines, HTTP request/response abstractions, and JSON body parsing.

### 3. SQLite & `sqlite3`
SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine. Unlike traditional client-server database engines (such as MySQL or PostgreSQL), SQLite reads and writes directly to standard disk files. The `sqlite3` package is the asynchronous native binding that connects Node.js applications to SQLite instances.

### 4. CRUD Operations
CRUD represents the four fundamental operations performed on persistent storage:
- **Create (POST):** Inserts new records into the database.
- **Read (GET):** Retrieves single or batch entity records without modifying state.
- **Update (PUT):** Updates existing record fields based on a unique identifier.
- **Delete (DELETE):** Removes a specified record permanently from the database.

---

## Technology Stack Summary

| Technology | Purpose | Role in Project |
|---|---|---|
| **Node.js** (v18+) | JavaScript Runtime | Executes the backend server application |
| **Express.js** (v4.18.2) | Web Framework | Manages routing, middleware, and HTTP transactions |
| **SQLite / sqlite3** (v5.1.6) | Database Engine | Provides embedded relational data persistence |
| **Nodemon** (v3.0.1) | Developer Tooling | Provides live server reloads during development |
| **Postman** | API Client | End-to-end testing of all CRUD endpoints |
| **DB Browser for SQLite** | Database GUI | Direct table data verification and inspection |

---

## Database Schema & Verification

### Table: `book`

```sql
CREATE TABLE IF NOT EXISTS book (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT    NOT NULL,
    author TEXT    NOT NULL,
    price  INTEGER NOT NULL,
    pages  INTEGER NOT NULL
);
```

### Column Specifications

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each book record |
| `title` | `TEXT` | `NOT NULL` | The title/name of the book |
| `author` | `TEXT` | `NOT NULL` | The author of the book |
| `price` | `INTEGER` | `NOT NULL` | Price in Indian Rupees (INR) |
| `pages` | `INTEGER` | `NOT NULL` | Total number of pages |

### Default Seed Data (9 Books)

| ID | Title | Author | Price (â‚¹) | Pages |
|---|---|---|---|---|
| 1 | The Pragmatic Programmer | David Thomas | 499 | 352 |
| 2 | Clean Code | Robert C. Martin | 450 | 464 |
| 3 | You Don't Know JS | Kyle Simpson | 350 | 278 |
| 4 | JavaScript: The Good Parts | Douglas Crockford | 299 | 176 |
| 5 | Eloquent JavaScript | Marijn Haverbeke | 399 | 472 |
| 6 | Node.js Design Patterns | Mario Casciaro | 549 | 660 |
| 7 | Learning Python | Mark Lutz | 599 | 1594 |
| 8 | Introduction to Algorithms | Thomas H. Cormen | 799 | 1292 |
| 9 | Design Patterns | Erich Gamma | 649 | 395 |

---

### Database Verification Screenshot
- **Inspection Tool:** DB Browser for SQLite
- **Database File:** `database.db`
- **Image URL / Path:** [LAB%202/database-verification.png](LAB%202/database-verification.png)

[![Database Verification](LAB%202/database-verification.png)](LAB%202/database-verification.png)

---

## Project Structure

```
lab-report-2/
â”œâ”€â”€ app.js               # Express application with routes and database initialization
â”œâ”€â”€ database.db          # Embedded SQLite database file (created automatically)
â”œâ”€â”€ initDB.sql           # SQL schema reference and seed queries
â”œâ”€â”€ package.json         # Project manifests, dependencies, and lifecycle scripts
â”œâ”€â”€ package-lock.json    # Deterministic dependency tree lockfile
â”œâ”€â”€ .gitignore           # Ignores node_modules, database.db, and log files
â”œâ”€â”€ test-api.js          # Automated end-to-end CRUD test script
â”œâ”€â”€ verify-db.js         # Quick terminal database verification utility
â”œâ”€â”€ README.md            # Comprehensive laboratory documentation
â””â”€â”€ LAB%202/         # Captured test verification screenshots
    â”œâ”€â”€ get-all-books.png
    â”œâ”€â”€ get-book-by-id.png
    â”œâ”€â”€ post-add-book.png
    â”œâ”€â”€ put-update-book.png
    â”œâ”€â”€ delete-book.png
    â””â”€â”€ database-verification.png
```

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (version 18.x or higher)
- npm (Node Package Manager)
- Postman (or any HTTP REST client)
- DB Browser for SQLite (optional, for GUI DB inspection)

### Step-by-Step Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd lab-report-2
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   - **Production mode:**
     ```bash
     npm start
     ```
   - **Development mode (with auto-reload):**
     ```bash
     npm run dev
     ```

4. **Run automated API tests:**
   ```bash
   node test-api.js
   ```

Once started, the server listens at:
```
http://localhost:3000
```

---

## CRUD API Endpoints & Topic Screenshots

### Base URL: `http://localhost:3000`

---

### Topic 1: GET All Books (`GET /books/`)
- **Method:** `GET`
- **Endpoint URL:** `http://localhost:3000/books/`
- **Description:** Retrieves all book records currently stored in the SQLite database.
- **Success Status Code:** `200 OK`
- **Screenshot URL / Path:** [LAB%202/get-all-books.png](LAB%202/get-all-books.png)

**Response Payload:**
```json
[
  {
    "id": 1,
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "price": 499,
    "pages": 352
  },
  {
    "id": 2,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 450,
    "pages": 464
  }
]
```

#### Screenshot: GET All Books
[![GET All Books](LAB%202/get-all-books.png)](LAB%202/get-all-books.png)

---

### Topic 2: GET Book by ID (`GET /books/:bookId/`)
- **Method:** `GET`
- **Endpoint URL:** `http://localhost:3000/books/1/`
- **Description:** Retrieves a single book by its unique primary key ID.
- **Success Status Code:** `200 OK`
- **Error Status Code:** `404 Not Found` (when the requested ID is not present)
- **Screenshot URL / Path:** [LAB%202/get-book-by-id.png](LAB%202/get-book-by-id.png)

**Response Payload (200 OK):**
```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "David Thomas",
  "price": 499,
  "pages": 352
}
```

#### Screenshot: GET Book by ID
[![GET Book By ID](LAB%202/get-book-by-id.png)](LAB%202/get-book-by-id.png)

---

### Topic 3: POST Add Book (`POST /books/`)
- **Method:** `POST`
- **Endpoint URL:** `http://localhost:3000/books/`
- **Header:** `Content-Type: application/json`
- **Description:** Validates incoming request body fields and inserts a new book record.
- **Success Status Code:** `201 Created`
- **Error Status Code:** `400 Bad Request` (when required fields are missing)
- **Screenshot URL / Path:** [LAB%202/post-add-book.png](LAB%202/post-add-book.png)

**Request Payload:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 450,
  "pages": 464
}
```

**Response Payload (201 Created):**
```json
{
  "id": 11,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 450,
  "pages": 464
}
```

#### Screenshot: POST Add Book
[![POST Add Book](LAB%202/post-add-book.png)](LAB%202/post-add-book.png)

---

### Topic 4: PUT Update Book (`PUT /books/:bookId/`)
- **Method:** `PUT`
- **Endpoint URL:** `http://localhost:3000/books/11/`
- **Header:** `Content-Type: application/json`
- **Description:** Updates details (title, author, price, pages) of an existing book identified by ID.
- **Success Status Code:** `200 OK`
- **Error Status Code:** `404 Not Found` (when the book ID does not exist)
- **Screenshot URL / Path:** [LAB%202/put-update-book.png](LAB%202/put-update-book.png)

**Request Payload:**
```json
{
  "title": "Clean Code Second Edition",
  "author": "Robert C. Martin",
  "price": 499,
  "pages": 480
}
```

**Response Payload (200 OK):**
```json
{
  "id": 11,
  "title": "Clean Code Second Edition",
  "author": "Robert C. Martin",
  "price": 499,
  "pages": 480
}
```

#### Screenshot: PUT Update Book
[![PUT Update Book](LAB%202/put-update-book.png)](LAB%202/put-update-book.png)

---

### Topic 5: DELETE Book (`DELETE /books/:bookId/`)
- **Method:** `DELETE`
- **Endpoint URL:** `http://localhost:3000/books/11/`
- **Description:** Removes a book record permanently from the database.
- **Success Status Code:** `200 OK`
- **Error Status Code:** `404 Not Found` (when the book ID does not exist)
- **Screenshot URL / Path:** [LAB%202/delete-book.png](LAB%202/delete-book.png)

**Response Payload (200 OK):**
```json
{
  "message": "Book with id 11 deleted successfully."
}
```

#### Screenshot: DELETE Book
[![DELETE Book](LAB%202/delete-book.png)](LAB%202/delete-book.png)

---

## Complete Screenshots Gallery & URL Master Index

All screenshots captured during testing are cataloged below with direct clickable links and full previews:

| # | Operation / Topic | Method | Target / Request URL | Status | Screenshot File & Link |
|---|---|---|---|---|---|
| 1 | **Database Verification** | â€” | `database.db` (DB Browser for SQLite) | Verified | [LAB%202/database-verification.png](LAB%202/database-verification.png) |
| 2 | **GET All Books** | `GET` | `http://localhost:3000/books/` | `200 OK` | [LAB%202/get-all-books.png](LAB%202/get-all-books.png) |
| 3 | **GET Book by ID** | `GET` | `http://localhost:3000/books/1/` | `200 OK` | [LAB%202/get-book-by-id.png](LAB%202/get-book-by-id.png) |
| 4 | **POST Add Book** | `POST` | `http://localhost:3000/books/` | `201 Created` | [LAB%202/post-add-book.png](LAB%202/post-add-book.png) |
| 5 | **PUT Update Book** | `PUT` | `http://localhost:3000/books/11/` | `200 OK` | [LAB%202/put-update-book.png](LAB%202/put-update-book.png) |
| 6 | **DELETE Book** | `DELETE` | `http://localhost:3000/books/11/` | `200 OK` | [LAB%202/delete-book.png](LAB%202/delete-book.png) |

---

### Visual Gallery

#### 1. SQLite Database Verification
- **URL / Path:** [LAB%202/database-verification.png](LAB%202/database-verification.png)

[![Database Verification](LAB%202/database-verification.png)](LAB%202/database-verification.png)

---

#### 2. GET All Books (`/books/`)
- **Request URL:** `http://localhost:3000/books/`
- **URL / Path:** [LAB%202/get-all-books.png](LAB%202/get-all-books.png)

[![GET All Books](LAB%202/get-all-books.png)](LAB%202/get-all-books.png)

---

#### 3. GET Book by ID (`/books/1/`)
- **Request URL:** `http://localhost:3000/books/1/`
- **URL / Path:** [LAB%202/get-book-by-id.png](LAB%202/get-book-by-id.png)

[![GET Book By ID](LAB%202/get-book-by-id.png)](LAB%202/get-book-by-id.png)

---

#### 4. POST Add Book (`/books/`)
- **Request URL:** `http://localhost:3000/books/`
- **URL / Path:** [LAB%202/post-add-book.png](LAB%202/post-add-book.png)

[![POST Add Book](LAB%202/post-add-book.png)](LAB%202/post-add-book.png)

---

#### 5. PUT Update Book (`/books/11/`)
- **Request URL:** `http://localhost:3000/books/11/`
- **URL / Path:** [LAB%202/put-update-book.png](LAB%202/put-update-book.png)

[![PUT Update Book](LAB%202/put-update-book.png)](LAB%202/put-update-book.png)

---

#### 6. DELETE Book (`/books/11/`)
- **Request URL:** `http://localhost:3000/books/11/`
- **URL / Path:** [LAB%202/delete-book.png](LAB%202/delete-book.png)

[![DELETE Book](LAB%202/delete-book.png)](LAB%202/delete-book.png)

---

## Testing Results & Verification Matrix

All five endpoints were thoroughly evaluated using automated test scripts and manual Postman invocations:

| Test Case | Method | Endpoint | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|
| Fetch all books | `GET` | `/books/` | `200 OK` | `200 OK` | âœ… Passed |
| Fetch existing book by ID | `GET` | `/books/1/` | `200 OK` | `200 OK` | âœ… Passed |
| Fetch non-existent book ID | `GET` | `/books/999/` | `404 Not Found` | `404 Not Found` | âœ… Passed |
| Create valid book record | `POST` | `/books/` | `201 Created` | `201 Created` | âœ… Passed |
| Create book with missing fields | `POST` | `/books/` | `400 Bad Request` | `400 Bad Request` | âœ… Passed |
| Update existing book record | `PUT` | `/books/11/` | `200 OK` | `200 OK` | âœ… Passed |
| Update non-existent book ID | `PUT` | `/books/999/` | `404 Not Found` | `404 Not Found` | âœ… Passed |
| Delete existing book record | `DELETE` | `/books/11/` | `200 OK` | `200 OK` | âœ… Passed |
| Delete non-existent book ID | `DELETE` | `/books/999/` | `404 Not Found` | `404 Not Found` | âœ… Passed |

---

## Problems Faced and Solutions

| # | Problem Encountered | Root Cause | Solution Implemented |
|---|---|---|---|
| 1 | **Database Asynchrony & Callback Hell** | The `sqlite3` driver relies on nested callback functions that complicate asynchronous request handling. | Created helper wrapper functions (`dbAll`, `dbGet`, `dbRun`) returning native Promises, enabling clean `async/await` syntax across all route handlers. |
| 2 | **Retrieving Newly Inserted Record in POST** | SQLite `INSERT` queries do not return the full inserted row directly in callback results. | Captured `this.lastID` inside the `db.run` callback and executed an immediate parameterized `SELECT * FROM book WHERE id = ?` to return the complete newly created entity with HTTP 201. |
| 3 | **Port Collision (`EADDRINUSE: 3000`)** | Previous background node processes retained ownership of port 3000. | Implemented a clean process cleanup routine targeting the specific owning PID before initiating server listening. |
| 4 | **SQL Injection Vulnerabilities** | Concatenating user inputs directly into raw SQL strings allows unauthorized query manipulation. | Enforced parameterized SQL statements using placeholder markers (`?`) for all queries containing external input. |
| 5 | **Partial PUT Payload Handling** | Sending a subset of updated fields could unintentionally overwrite unmentioned columns with `NULL` or `undefined`. | Applied a fallback merging strategy checking `field !== undefined ? field : existing.field` before applying SQL updates. |

---

## Conclusion

The project successfully demonstrates the design and deployment of a modular, secure, and resilient RESTful API utilizing Node.js, Express, and SQLite. All five CRUD routes conform strictly to HTTP conventions, error handling scenarios are accounted for, and end-to-end database persistence has been verified through Postman and DB Browser for SQLite.

---

## License

ISC License Â© 2026 Naga Manikanta Addaguri. Developed for educational laboratory assessment at NIAT.

