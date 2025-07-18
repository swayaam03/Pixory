const express = require('express');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User registered successfully' });
  });
});

// Login (basic version)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: 'Invalid credentials' });
    res.send({ message: 'Login successful', user: results[0] });
  });
});

module.exports = router;
