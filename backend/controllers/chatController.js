const { callApi } = require('../services/chatService'); // Import the service function

exports.handleChat = async (req, res) => {
    try {
        const { userMessage, chatLog } = req.body;
        console.log('Received user message:', userMessage, chatLog);

        // Step 1: Call the API to get the story or conversation
        const story = await callApi(userMessage, chatLog);
        if (!story || story.startsWith('Invalid')) {
            console.error("Failed to generate story:", story);
            return res.status(400).json({ error: 'Failed to generate story.' });
        }

        // Include the story in the response
        res.json({ message: story });
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: error.message });
    }
};


