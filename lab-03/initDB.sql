-- ============================================================
-- Lab 03 – Books Database Schema and Seed Data
-- Course: Backend Development Fundamentals
-- Student: Naga Manikanta Addaguri (252U1R9001)
-- ============================================================

-- Create the books table if it does not already exist.
-- Using IF NOT EXISTS so the app can restart safely without errors.

CREATE TABLE IF NOT EXISTS books (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT    NOT NULL,
    author  TEXT    NOT NULL,
    price   REAL    NOT NULL,
    pages   INTEGER
);

-- SEED DATA
-- The application only runs these INSERT statements when the table is empty,
-- so restarting the server will not create duplicate rows.

INSERT INTO books (title, author, price, pages) VALUES
('Learning Node.js', 'Shelley Powers', 449, 372);

INSERT INTO books (title, author, price, pages) VALUES
('Express.js Guide', 'Azat Mardan', 350, 258);

INSERT INTO books (title, author, price, pages) VALUES
('JavaScript: The Good Parts', 'Douglas Crockford', 299, 176);

INSERT INTO books (title, author, price, pages) VALUES
('Python Crash Course', 'Eric Matthes', 550, 544);

INSERT INTO books (title, author, price, pages) VALUES
('Clean Code', 'Robert C. Martin', 650, 464);

INSERT INTO books (title, author, price, pages) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', 899, 1312);

INSERT INTO books (title, author, price, pages) VALUES
('Database System Concepts', 'Abraham Silberschatz', 750, 1376);

INSERT INTO books (title, author, price, pages) VALUES
('Head First Java', 'Kathy Sierra', 499, 720);

INSERT INTO books (title, author, price, pages) VALUES
('The Pragmatic Programmer', 'David Thomas', 599, 352);

INSERT INTO books (title, author, price, pages) VALUES
('AI: A Modern Approach', 'Stuart Russell', 950, 1152);

