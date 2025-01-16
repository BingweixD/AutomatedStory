const axios = require('axios');
const { createCoverImagePrompt, findSplitIndex } = require('../utils/openaiUtil'); // Use shared OpenAI instance
const DALLE_API_KEY = process.env.DALLE_API_KEY; // Ensure this is defined in your .env file

async function generateImage(story, styleHints, previousAttributes, referenceImages = [], seed = null) {
    console.time("generateImage"); // Start timing
    console.log("Using seed for image generation:", seed);

    const coverPrompt = createCoverImagePrompt(story); // Use utility function
    const splitIndex = findSplitIndex(story, Math.floor(story.length / 2)); // Use utility function
    const parts = [
        story.substring(0, splitIndex),
        story.substring(splitIndex),
    ];
    const prompts = [coverPrompt, ...parts];

    const imagePromises = prompts.map((prompt, index) => {
        if (index === 0) {
            prompt = `Generate a cover image for a story with the following theme: "${prompt}"`;
        } else {
            prompt = `${prompt.trim()}.`;
        }

        if (styleHints) prompt += ` Style hints: ${styleHints}.`;
        if (previousAttributes) prompt += ` Include ${previousAttributes}, maintaining the color palette and character design of previous images.`;
        if (referenceImages && referenceImages.length > 0) prompt += ` Reference images are provided to maintain consistency.`;

        // Create the payload for the OpenAI API
        const payload = {
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        };
        if (seed !== null) {
            payload.seed = seed;
        }

        // Call the API
        return axios.post('https://api.openai.com/v1/images/generations', payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DALLE_API_KEY}`,
            },
        })
        .then(response => {
            if (response.data && response.data.data && response.data.data.length > 0) {
                return response.data.data[0].url; // Return the generated image URL
            } else {
                console.log("API response did not contain any images. Response:", response.data);
                return '';
            }
        })
        .catch(error => {
            console.error("An error occurred while generating the image:", error);
            return '';
        });
    });

    try {
        const start = performance.now(); // Start performance timer
        const imageUrls = await Promise.all(imagePromises); // Wait for all image generation requests
        const end = performance.now(); // End performance timer
        console.log(`Image generation took ${end - start} milliseconds.`);

        console.timeEnd("generateImage"); // End timing
        return imageUrls; // Return all generated image URLs
    } catch (error) {
        console.error("An error occurred while generating images:", error);
        console.timeEnd("generateImage"); // End timing even if there's an error
        return [];
    }
}

module.exports = {
    generateImage,
};
