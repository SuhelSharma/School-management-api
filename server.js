require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// Example route to test DB connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
