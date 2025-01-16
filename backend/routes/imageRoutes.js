const express = require('express');
const router = express.Router();
const { handleImageGeneration } = require('../controllers/imageController');

router.post('/generate-image', handleImageGeneration);

module.exports = router;
