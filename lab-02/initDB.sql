-- initDB.sql
-- Creates the book table and inserts 9 sample records

CREATE TABLE IF NOT EXISTS book (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT    NOT NULL,
    author TEXT    NOT NULL,
    price  INTEGER NOT NULL,
    pages  INTEGER NOT NULL
);

INSERT INTO book (title, author, price, pages) VALUES
    ('The Pragmatic Programmer', 'David Thomas', 499, 352),
    ('Clean Code', 'Robert C. Martin', 450, 464),
    ('You Don''t Know JS', 'Kyle Simpson', 350, 278),
    ('JavaScript: The Good Parts', 'Douglas Crockford', 299, 176),
    ('Eloquent JavaScript', 'Marijn Haverbeke', 399, 472),
    ('Node.js Design Patterns', 'Mario Casciaro', 549, 660),
    ('Learning Python', 'Mark Lutz', 599, 1594),
    ('Introduction to Algorithms', 'Thomas H. Cormen', 799, 1292),
    ('Design Patterns', 'Erich Gamma', 649, 395);

