# Backend Development Fundamentals – Coursework

- **Student Name:** Naga Manikanta Addaguri
- **GitHub Username:** gamingwithdinog151-web
- **Repository:** [backend-development-fundamentals-labs-2](https://github.com/gamingwithdinog151-web/backend-development-fundamentals-labs-2)

---

## Laboratory Assignments

This repository contains the complete coursework for **Backend Development Fundamentals**, structured into modular lab projects:

### 📁 [Lab 01 – Node.js and Express Server](./lab-01/)
A foundational backend project demonstrating native Node.js HTTP server creation and Express.js routing, JSON serialization, dynamic datetime handling, and custom 404 middleware.

- **Directory:** [`lab-01/`](./lab-01/)
- **Key Files:** `app.js`, `server.js`, `test-api.js`, `package.json`, `README.md`
- **Screenshots:** [`lab-01/screenshots/`](./lab-01/screenshots/)
  - `home.png` – GET `/` (200 OK)
  - `about.png` – GET `/about` (200 OK)
  - `time.png` – GET `/time` (200 OK)
  - `404-not-found.png` – GET `/unknown` (404 Not Found)

---

### 📁 [Lab 02 – SQLite Database and CRUD Routes](./lab-02/)
A full RESTful API implementation performing complete CRUD (Create, Read, Update, Delete) operations on an embedded SQLite database (`database.db`) using Express.js and the `sqlite3` driver.

- **Directory:** [`lab-02/`](./lab-02/)
- **Key Files:** `app.js`, `initDB.sql`, `verify-db.js`, `test-api.js`, `package.json`, `README.md`
- **Screenshots:** [`lab-02/LAB 2/`](./lab-02/LAB%202/)
  - `database-verification.png` – Initial SQLite schema and seed verification
  - `get-all-books.png` – GET `/books/` (200 OK)
  - `get-book-by-id.png` – GET `/books/:bookId/` (200 OK)
  - `post-add-book.png` – POST `/books/` (201 Created)
  - `put-update-book.png` – PUT `/books/:bookId/` (200 OK)
  - `delete-book.png` – DELETE `/books/:bookId/` (200 OK)

---

## Project Structure Overview

```text
backend-development-fundamentals-labs-2/
│
├── lab-01/                              # Lab 1: Node.js & Express Server
│   ├── screenshots/
│   │   ├── home.png
│   │   ├── about.png
│   │   ├── time.png
│   │   └── 404-not-found.png
│   ├── .gitignore
│   ├── README.md
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── test-api.js
│
├── lab-02/                              # Lab 2: SQLite Database & CRUD Routes
│   ├── LAB 2/
│   │   ├── database-verification.png
│   │   ├── delete-book.png
│   │   ├── get-all-books.png
│   │   ├── get-book-by-id.png
│   │   ├── post-add-book.png
│   │   └── put-update-book.png
│   ├── .gitignore
│   ├── README.md
│   ├── app.js
│   ├── initDB.sql
│   ├── package.json
│   ├── package-lock.json
│   ├── test-api.js
│   └── verify-db.js
│
├── .gitignore
└── README.md                            # Main Coursework Hub
```
