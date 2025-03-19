const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController'); // Correct relative path

// POST: Add School
router.post('/addSchool', schoolController.addSchool);

// GET: List Schools
router.get('/listSchools', schoolController.listSchools);

module.exports = router;
