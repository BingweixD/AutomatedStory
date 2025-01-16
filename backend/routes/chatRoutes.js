const express = require('express');
const { handleChat } = require('../controllers/chatController');
const { generateImage } = require('../services/imageService');
const { extractFlexibleTitle, getNextImageUrl } = require('../utils/storyUtils');
const PDFDocument = require('pdfkit');

const router = express.Router();

router.post('/', handleChat); // Use handleChat for the root route

router.post('/generate-image', async (req, res) => {
    const { prompt, styleHints, previousAttributes } = req.body;
    try {
        const imageUrls = await generateImage(prompt, styleHints, previousAttributes);
        if (!imageUrls) return res.status(400).json({ error: 'Failed to generate images.' });
        res.json({ imageUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-pdf', async (req, res) => {
    const { chatLog } = req.body;
    const storyContent = "StoryBook";
    const title = extractFlexibleTitle(storyContent);

    const doc = new PDFDocument();
    const buffers = [];
    let usedImageUrls = new Set();

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=storybook.pdf',
        }).end(pdfData);
    });

    doc.fontSize(24)
        .font('Helvetica-Bold')
        .text(title, { align: 'center' })
        .moveDown(2);

    let coverImageUrl = getNextImageUrl(chatLog, usedImageUrls);
    if (coverImageUrl) {
        try {
            const coverImageResponse = await fetch(coverImageUrl);
            if (coverImageResponse.ok) {
                const coverImageBuffer = await coverImageResponse.buffer();
                doc.image(coverImageBuffer, { fit: [500, 400], align: 'center' }).addPage();
            }
        } catch (error) {
            console.error("Error fetching cover image:", error);
        }
    }

    doc.end();
});

module.exports = router;
