const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 5000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send({ message: 'File uploaded', filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
