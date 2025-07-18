const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new trip
router.post('/create', (req, res) => {
  const { name, owner_id } = req.body;
  const sql = 'INSERT INTO trips (name, owner_id) VALUES (?, ?)';
  db.query(sql, [name, owner_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Trip created', tripId: result.insertId });
  });
});

// Upload media to trip
router.post('/upload', (req, res) => {
  const { trip_id, file_path, uploaded_by } = req.body;
  const sql = 'INSERT INTO media (trip_id, file_path, uploaded_by) VALUES (?, ?, ?)';
  db.query(sql, [trip_id, file_path, uploaded_by], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Media uploaded' });
  });
});

// Get all media for a trip
router.get('/:tripId/media', (req, res) => {
  const sql = 'SELECT * FROM media WHERE trip_id = ?';
  db.query(sql, [req.params.tripId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

module.exports = router;
