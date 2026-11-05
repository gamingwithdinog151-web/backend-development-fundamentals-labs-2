// ============================================================
// database.js – SQLite Database Connection and Initialization
// ============================================================
// This module handles three things:
//   1. Creating / opening the SQLite database file (books.db).
//   2. Wrapping sqlite3 callback methods into Promises so we
//      can use async/await in our routes (cleaner code).
//   3. Running initDB.sql on startup to create the table and
//      seed sample data (only if the table is empty).
// ============================================================

const sqlite3 = require('sqlite3').verbose(); // .verbose() gives better error messages
const path = require('path');
const fs = require('fs');

// --------------- Database file path ---------------
// The .db file is created next to this script.
// It is listed in .gitignore so it won't be committed.
const DB_PATH = path.join(__dirname, 'books.db');

// --------------- Open the connection ---------------
// sqlite3.Database() opens the file if it exists, or creates it if not.
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at', DB_PATH);
  }
});

// ============================================================
// Promise Wrappers
// ============================================================
// The sqlite3 package uses old-style callbacks. Wrapping them
// in Promises lets us write:   const row = await dbGet(sql);
// instead of nested callbacks.
// ============================================================

/**
 * Run a SQL statement that does NOT return rows (INSERT, UPDATE, DELETE).
 * Resolves with { lastID, changes } so we know the inserted id or
 * how many rows were affected.
 */
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      // NOTE: we use a regular function (not arrow) so `this` gives
      // us lastID and changes from sqlite3.
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Run a SQL query that returns ONE row (e.g. SELECT ... WHERE id = ?).
 * Resolves with the row object, or undefined if no match.
 */
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Run a SQL query that returns MULTIPLE rows (e.g. SELECT * FROM books).
 * Resolves with an array of row objects.
 */
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Execute raw SQL that may contain multiple statements (used for initDB.sql).
 * db.exec() does not support parameterized queries, but that is fine here
 * because initDB.sql is our own trusted file, not user input.
 */
function dbExec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ============================================================
// Database Initialization
// ============================================================
// Called once when the server starts. It:
//   1. Reads initDB.sql and runs the CREATE TABLE statement.
//   2. Checks if the books table is empty.
//   3. If empty, runs the INSERT statements to add sample data.
// This design means you can restart the server many times
// without getting duplicate rows.
// ============================================================

async function initializeDatabase() {
  // Read the full SQL file
  const sqlFilePath = path.join(__dirname, 'initDB.sql');
  const fullSQL = fs.readFileSync(sqlFilePath, 'utf-8');

  // ---- Step 1: Split at the "-- SEED DATA" marker ----
  // Everything above the marker is the CREATE TABLE statement.
  // Everything below the marker is the INSERT statements.
  const marker = '-- SEED DATA';
  const markerIndex = fullSQL.indexOf(marker);

  let createSQL, seedSQL;

  if (markerIndex !== -1) {
    createSQL = fullSQL.substring(0, markerIndex);
    seedSQL = fullSQL.substring(markerIndex + marker.length);
  } else {
    // If no marker found, treat the whole file as schema
    createSQL = fullSQL;
    seedSQL = '';
  }

  // ---- Step 2: Create the table ----
  await dbExec(createSQL);
  console.log('✅ Books table is ready');

  // ---- Step 3: Seed data only if the table is empty ----
  const row = await dbGet('SELECT COUNT(*) AS count FROM books');

  if (row.count === 0 && seedSQL.trim().length > 0) {
    await dbExec(seedSQL);
    console.log('✅ Database seeded with 10 sample books');
  } else {
    console.log(`ℹ️  Database already has ${row.count} book(s), skipping seed`);
  }
}

// ============================================================
// Export everything the rest of the app needs
// ============================================================
module.exports = {
  dbRun,
  dbGet,
  dbAll,
  initializeDatabase,
};

