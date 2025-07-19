const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Pixory server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
