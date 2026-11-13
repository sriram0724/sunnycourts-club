// Part 3: REST endpoints (Courts CRUD + Search + Twist) -> Save as routes/courts.js
const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/database');
const { validateCourt } = require('../middleware/validate');
const { smartSearchCourts } = require('../utils/smartSearch');

// GET /courts (supports ?q=word Smart Search and ?sport=value filter)
router.get('/', async (req, res, next) => {
  try {
    const { q, sport } = req.query;

    // Part 5 Twist: Smart Search (?q=word)
    if (q !== undefined) {
      return smartSearchCourts(q, res);
    }

    // Part 4 Query Parameter Search (?sport=Tennis)
    if (sport !== undefined) {
      const rows = await all(
        'SELECT * FROM courts WHERE LOWER(sport) = LOWER(?)',
        [sport.trim()]
      );
      return res.status(200).json(rows);
    }

    // Get all courts
    const courts = await all('SELECT * FROM courts');
    return res.status(200).json(courts);
  } catch (err) {
    next(err);
  }
});

// GET /courts/:id - Get one court
router.get('/:id', async (req, res, next) => {
  try {
    const court = await get('SELECT * FROM courts WHERE id = ?', [req.params.id]);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    return res.status(200).json(court);
  } catch (err) {
    next(err);
  }
});

// POST /courts - Add a new court
router.post('/', validateCourt, async (req, res, next) => {
  try {
    const { name, sport } = req.body;
    const result = await run(
      'INSERT INTO courts (name, sport) VALUES (?, ?)',
      [name.trim(), sport.trim()]
    );
    const created = await get('SELECT * FROM courts WHERE id = ?', [result.id]);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /courts/:id - Update an existing court
router.put('/:id', validateCourt, async (req, res, next) => {
  try {
    const { name, sport } = req.body;
    const result = await run(
      'UPDATE courts SET name = ?, sport = ? WHERE id = ?',
      [name.trim(), sport.trim(), req.params.id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    const updated = await get('SELECT * FROM courts WHERE id = ?', [req.params.id]);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /courts/:id - Delete a court
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await run('DELETE FROM courts WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    return res.status(200).json({ message: 'Court deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;