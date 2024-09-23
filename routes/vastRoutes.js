// routes/vastRoutes.js
const express = require('express');
const router = express.Router();
const vastController = require('../controllers/vastController');

// Route to parse and store VAST data
router.post('/parse', vastController.parseAndStoreVAST);

// Route to get VAST data by ID
router.get('/:id', vastController.getVASTById);

module.exports = router;
