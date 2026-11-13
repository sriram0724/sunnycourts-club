// Part 1: Server and routes -> Save as server.js (project root)
const express = require('express');
const playersRouter = require('./routes/players');
const courtsRouter = require('./routes/courts');
const reservationsRouter = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to SunnyCourts Club API',
    endpoints: ['/players', '/courts', '/reservations']
  });
});

// Mount resource routes
app.use('/players', playersRouter);
app.use('/courts', courtsRouter);
app.use('/reservations', reservationsRouter);

// Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SunnyCourts Club server running on http://localhost:${PORT}`);
});