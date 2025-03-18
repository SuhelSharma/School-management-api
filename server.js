const express = require('express');
const app = express();
require('dotenv').config();

// Import Routes
const schoolRoutes = require('./routes/schoolRoutes'); // Correct relative path

// Middleware
app.use(express.json());

// API Routes
app.use('/api', schoolRoutes);

// Default route (optional, for testing base URL)
app.get('/', (req, res) => {
    res.send('Welcome to School Management API');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
