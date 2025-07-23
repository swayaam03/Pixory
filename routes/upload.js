// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../db');

// Ensure uploads directory exists
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Setting destination to uploads/');
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        console.log('Generated filename:', uniqueName);
        cb(null, uniqueName);
    }
});

// File filter (optional - to restrict file types)
const fileFilter = (req, file, cb) => {
    console.log('File mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Upload media to a trip
router.post('/:trip_id', (req, res) => {
    console.log('Upload request received for trip:', req.params.trip_id);
    console.log('Request body before multer:', req.body);
    
    upload.single('media')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).send({ message: 'Upload error: ' + err.message });
        } else if (err) {
            console.error('Other error:', err);
            return res.status(400).send({ message: err.message });
        }

        console.log('Request body after multer:', req.body);
        console.log('Uploaded file:', req.file);

        const trip_id = req.params.trip_id;
        const user_id = req.body.user_id;
        const file = req.file;

        // Validation
        if (!file) {
            console.log('No file in request');
            return res.status(400).send({ message: 'No file uploaded' });
        }

        if (!user_id) {
            console.log('No user_id in request');
            return res.status(400).send({ message: 'user_id is required' });
        }

        const sql = 'INSERT INTO media (trip_id, user_id, file_path, file_type) VALUES (?, ?, ?, ?)';
        const fileType = file.mimetype.startsWith('video') ? 'video' : 'image';

        console.log('Inserting into database:', { trip_id, user_id, filename: file.filename, fileType });

        db.query(sql, [trip_id, user_id, file.filename, fileType], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send({ message: 'Database error', error: err });
            }
            
            console.log('Upload successful, result:', result);
            res.send({ 
                message: 'Media uploaded successfully',
                file: {
                    filename: file.filename,
                    originalname: file.originalname,
                    size: file.size,
                    type: fileType
                }
            });
        });
    });
});

// Fetch media of a trip
router.get('/:trip_id', (req, res) => {
    const sql = 'SELECT * FROM media WHERE trip_id = ?';
    db.query(sql, [req.params.trip_id], (err, results) => {
        if (err) {
            console.error('Database error fetching media:', err);
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

module.exports = router;