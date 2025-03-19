// controllers/schoolController.js
const pool = require('../db'); // adjust path if needed

// Example function to get all schools:
exports.getAllSchools = (req, res) => {
  pool.query('SELECT * FROM schools', (err, result) => {
    if (err) {
      console.error('Error fetching schools', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(200).json(result.rows); // Note: use .rows
    }
  });
};

// Example function to add school:
exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  pool.query(
    'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4)',
    [name, address, latitude, longitude],
    (err, result) => {
      if (err) {
        console.error('Error inserting school', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ message: 'School added successfully' });
      }
    }
  );
};
