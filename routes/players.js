// Part 3: REST endpoints (Players) -> Save as routes/players.js
const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db/database');
const { validatePlayer } = require('../middleware/validate');

// GET /players - Get all players
router.get('/', async (req, res, next) => {
  try {
    const players = await all('SELECT * FROM players');
    return res.status(200).json(players);
  } catch (err) {
    next(err);
  }
});

// GET /players/:id - Get one player
router.get('/:id', async (req, res, next) => {
  try {
    const player = await get('SELECT * FROM players WHERE id = ?', [req.params.id]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    return res.status(200).json(player);
  } catch (err) {
    next(err);
  }
});

// POST /players - Add a player
router.post('/', validatePlayer, async (req, res, next) => {
  try {
    const { name, email = null, phone = null } = req.body;
    const result = await run(
      'INSERT INTO players (name, email, phone) VALUES (?, ?, ?)',
      [name.trim(), email, phone]
    );
    const created = await get('SELECT * FROM players WHERE id = ?', [result.id]);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;