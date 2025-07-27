const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoute = require('./routes/upload');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
