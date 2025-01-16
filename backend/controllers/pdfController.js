const PDFDocument = require('pdfkit');
const fetch = require('node-fetch');
const { findSplitIndex, getNextImageUrl, extractFlexibleTitle } = require('../utils/storyutils');

exports.generatePDF = async (req, res) => {
    const { chatLog } = req.body;

    try {
        const storyContent = chatLog.find(entry => entry.role === 'gpt' && !entry.message.startsWith('Image URL: ')).message;
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

        // Add the title to the PDF
        doc.fontSize(24).font('Helvetica-Bold').text(title, { align: 'center' }).moveDown(2);

        // Find the longest story in the chat log
        const longestStory = chatLog.filter(entry => entry.role === 'gpt' && !entry.message.startsWith('Image URL: '))
                                     .reduce((longest, current) => current.message.length > longest.message.length ? current : longest, { message: "" }).message;

        // Calculate approximate split points
        const firstSplit = Math.floor(longestStory.length / 3);
        const secondSplit = Math.floor(2 * longestStory.length / 3);

        // Adjust split points to the nearest sentence end
        const firstSplitIndex = findSplitIndex(longestStory, firstSplit);
        const secondSplitIndex = findSplitIndex(longestStory, secondSplit);

        // Split the story into parts and add to PDF
        const parts = [
            longestStory.substring(0, firstSplitIndex),
            longestStory.substring(firstSplitIndex, secondSplitIndex),
            longestStory.substring(secondSplitIndex)
        ];

        for (const part of parts) {
            doc.addPage();
            doc.font('Times-Roman').fontSize(14).fillColor('blue').text(part.trim(), {
                paragraphGap: 5,
                indent: 20,
                align: 'justify',
                columns: 1,
            });

            // Add images if available
            let imageUrl = getNextImageUrl(chatLog, usedImageUrls);
            if (imageUrl) {
                try {
                    const imageResponse = await fetch(imageUrl);
                    if (imageResponse.ok) {
                        const imageBuffer = await imageResponse.buffer();
                        doc.addPage();
                        doc.image(imageBuffer, { fit: [500, 500], align: 'center', valign: 'center' });
                    } else {
                        console.error("Failed to load image for PDF:", imageResponse.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching image for PDF:", error);
                }
            }
        }

        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};
