// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Pixory backend running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

app.listen(5000, () => {
  console.log('🌍 Server running on port 5000');
});
