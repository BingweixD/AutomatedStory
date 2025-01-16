const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController'); // Import the controller function

router.post('/generate-pdf', generatePDF); // Map the endpoint to the controller function

module.exports = router;
