// Part 2: Database -> Save as db/database.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'sunnycourts.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Enable foreign key constraints and initialize the 3 related tables
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sport TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      court_id INTEGER NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
      UNIQUE (court_id, booking_date, time_slot)
    )
  `);

  // Seed initial sample data only if tables are empty
  db.get('SELECT COUNT(*) AS count FROM courts', (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO courts (name, sport) VALUES
        ('Court A1', 'Tennis'),
        ('Court B2', 'Badminton'),
        ('Center Court', 'Basketball'),
        ('Court C1', 'Pickleball')
      `);
    }
  });

  db.get('SELECT COUNT(*) AS count FROM players', (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO players (name, email, phone) VALUES
        ('Sriram', 'sriram@example.com', '9876543210'),
        ('Ananya', 'ananya@example.com', '9876543211'),
        ('Rohan', 'rohan@example.com', '9876543212')
      `);
    }
  });
});

// Promise helpers for clean async/await queries
const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });

module.exports = { db, all, get, run };