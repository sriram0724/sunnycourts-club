// Part 3: REST endpoints (Reservations + Join endpoint) -> Save as routes/reservations.js
const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/database');
const { validateReservation } = require('../middleware/validate');

// JOIN ENDPOINT: GET /reservations - Reservations with player name and court name
router.get('/', async (req, res, next) => {
  try {
    const rows = await all(`
      SELECT
        r.id,
        r.booking_date,
        r.time_slot,
        p.id AS player_id,
        p.name AS player_name,
        c.id AS court_id,
        c.name AS court_name,
        c.sport
      FROM reservations r
      INNER JOIN players p ON r.player_id = p.id
      INNER JOIN courts c ON r.court_id = c.id
      ORDER BY r.booking_date, r.time_slot
    `);
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /reservations - Book a court slot (prevents double-booking)
router.post('/', validateReservation, async (req, res, next) => {
  try {
    const { player_id, court_id, booking_date, time_slot } = req.body;

    const player = await get('SELECT id FROM players WHERE id = ?', [player_id]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const court = await get('SELECT id FROM courts WHERE id = ?', [court_id]);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    const result = await run(
      'INSERT INTO reservations (player_id, court_id, booking_date, time_slot) VALUES (?, ?, ?, ?)',
      [player_id, court_id, booking_date.trim(), time_slot.trim()]
    );

    const created = await get(
      `
      SELECT
        r.id,
        r.booking_date,
        r.time_slot,
        p.name AS player_name,
        c.name AS court_name,
        c.sport
      FROM reservations r
      INNER JOIN players p ON r.player_id = p.id
      INNER JOIN courts c ON r.court_id = c.id
      WHERE r.id = ?
      `,
      [result.id]
    );
    return res.status(201).json(created);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'This court is already booked for that date and time slot'
      });
    }
    next(err);
  }
});

// DELETE /reservations/:id - Cancel a reservation
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await run('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    return res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;