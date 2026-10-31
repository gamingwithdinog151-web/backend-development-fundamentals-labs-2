const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));
db.all('SELECT * FROM book', (err, rows) => {
  if (err) { console.error(err); process.exit(1); }
  console.log('=== book table contents ===');
  console.table(rows);
  db.close();
});

