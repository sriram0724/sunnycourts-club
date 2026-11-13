// Part 4: Validation and search -> Save as middleware/validate.js

function validateCourt(req, res, next) {
  const { name, sport } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: "name" is required and must be a non-empty string'
    });
  }

  if (!sport || typeof sport !== 'string' || sport.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: "sport" is required and must be a non-empty string'
    });
  }

  next();
}

function validatePlayer(req, res, next) {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: "name" is required and must be a non-empty string'
    });
  }

  next();
}

function validateReservation(req, res, next) {
  const { player_id, court_id, booking_date, time_slot } = req.body;

  if (!player_id || !Number.isInteger(Number(player_id))) {
    return res.status(400).json({
      error: 'Validation failed: "player_id" is required and must be a valid integer'
    });
  }

  if (!court_id || !Number.isInteger(Number(court_id))) {
    return res.status(400).json({
      error: 'Validation failed: "court_id" is required and must be a valid integer'
    });
  }

  if (!booking_date || typeof booking_date !== 'string' || booking_date.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: "booking_date" is required (e.g. "2026-11-16")'
    });
  }

  if (!time_slot || typeof time_slot !== 'string' || time_slot.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: "time_slot" is required (e.g. "18:00")'
    });
  }

  next();
}

module.exports = {
  validateCourt,
  validatePlayer,
  validateReservation
};