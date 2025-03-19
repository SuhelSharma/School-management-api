const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.get('/schools', schoolController.getAllSchools);
router.post('/addSchool', schoolController.addSchool);

module.exports = router;
