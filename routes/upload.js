// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../db');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Upload media to a trip
router.post('/:trip_id', upload.single('media'), (req, res) => {
    const trip_id = req.params.trip_id;
    const user_id = req.body.user_id;
    const file = req.file;

    if (!file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const sql = 'INSERT INTO media (trip_id, user_id, file_path, file_type) VALUES (?, ?, ?, ?)';
    const fileType = file.mimetype.startsWith('video') ? 'video' : 'image';

    db.query(sql, [trip_id, user_id, file.filename, fileType], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Media uploaded successfully' });
    });
});

// Fetch media of a trip
router.get('/:trip_id', (req, res) => {
    const sql = 'SELECT * FROM media WHERE trip_id = ?';
    db.query(sql, [req.params.trip_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

module.exports = router;
