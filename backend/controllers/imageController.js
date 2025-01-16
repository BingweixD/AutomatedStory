// const { generateImage } = require('../services/ImageService'); // Import the service

// exports.generateImageHandler = async (req, res) => {
//     const { prompt, styleHints, previousAttributes } = req.body;
//     console.log('Received prompt for image generation:', prompt);

//     try {
//         // Call the service function to generate images
//         const imageUrls = await generateImage(prompt, styleHints, previousAttributes);
//         if (!imageUrls || imageUrls.length === 0) {
//             console.error("Failed to generate images.");
//             return res.status(400).json({ error: 'Failed to generate images.' });
//         }

//         // Return the generated image URLs
//         res.json({ imageUrls });
//     } catch (error) {
//         console.error("Error handling image generation request:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

const { generateImage } = require('../services/imageService');

const handleImageGeneration = async (req, res) => {
    const { story, styleHints } = req.body;
    try {
        const imageUrls = await generateImage(story, styleHints);
        res.json({ imageUrls });
    } catch (error) {
        console.error("Error generating images:", error);
        res.status(500).json({ error: "Failed to generate images." });
    }
};

module.exports = { handleImageGeneration };

