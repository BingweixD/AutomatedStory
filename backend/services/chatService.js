const openai = require('../utils/openaiUtil'); // Shared OpenAI instance

const generateStory = async (userMessage, chatLog) => {
try{
  const formattedMessages = chatLog.map((msg) => ({
    role: msg.role === "me" ? "user" : msg.role === "gpt" ? "assistant" : msg.role,
    content: msg.message,
  }));
  formattedMessages.push({ role: "user", content: userMessage });
  console.log("Formatted Messages for Story Generation:", JSON.stringify(formattedMessages, null, 2));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
    max_tokens: 1000,
  });

    const content = response.choices?.[0]?.message?.content || "Error generating response";
    console.log("Generated Story Content:", content);

        return content;
    } catch (error) {
    console.error("Error generating story:", error.message);
    console.error("Error stack:", error.stack);
    return "An error occurred while generating the story.";
    }
};

const callApi = async (userMessage, chatLog) => {
    try {
        const startTime = Date.now();

        // Validate userMessage
        if (!userMessage || typeof userMessage !== 'string') {
            console.error("Invalid user message:", userMessage);
            return 'Invalid user message.';
        }

        // Validate chatLog
        if (!Array.isArray(chatLog)) {
            console.error("Invalid chat log:", chatLog);
            return 'Invalid chat log.';
        }

        // Map roles in chatLog ('me' to 'user' and 'gpt' to 'assistant')
        const formattedMessages = chatLog.map(msg => ({
            role: msg.role === 'me' ? 'user' : (msg.role === 'gpt' ? 'assistant' : msg.role),
            content: msg.message || msg.content || ''
        }));

        // // Validate formattedMessages
        // const isValid = formattedMessages.every(msg => typeof msg.content === 'string');
        // if (!isValid) {
        //     console.error("Invalid formatted message:", formattedMessages);
        //     return 'Invalid input data.';
        // }

        // Add the latest user message to the formattedMessages array
        formattedMessages.push({ role: 'user', content: userMessage });

        console.log('Formatted Messages:', formattedMessages);

        const chatCompletion = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-1106:personal::8hke3Plj",
            messages: formattedMessages.concat([
                { 
                    role: 'system', 
                    content: 'Please focus on helping the user create a story. Tell user that it is not related to story creation and get back in creating children story.' 
                }
            ]),
            max_tokens: 1000,
        });

        const content = chatCompletion.choices?.[0]?.message?.content;
        if (!content) {
            console.error("Invalid or incomplete response from OpenAI API:", chatCompletion);
            return 'An error occurred while fetching data.';
        }

        const duration = Date.now() - startTime;
        console.log(`API call duration: ${duration}ms`);
        console.log("Generated Story Content:", content);

        return content;
    } catch (error) {
        console.error("Error during API call:", error.message);
        console.error("Error stack:", error.stack);
        return "An error occurred while fetching data.";
    }
};

module.exports = {
    callApi, 
    generateStory,
};


// const openai = require('../utils/openaiUtil'); // Shared OpenAI instance

// const generateStory = async (userMessage, chatLog) => {
//     try {
//         // Format the chat log
//         const formattedMessages = chatLog.map((msg) => ({
//             role: msg.role === "me" ? "user" : msg.role === "gpt" ? "assistant" : msg.role,
//             content: msg.message,
//         }));

//         // Add the latest user message
//         formattedMessages.push({ role: "user", content: userMessage });

//         console.log("Formatted Messages for Story Generation:", JSON.stringify(formattedMessages, null, 2));

//         // Call OpenAI API
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: formattedMessages,
//             max_tokens: 1000,
//         });

//         // Safely extract content
//         const content = response.choices?.[0]?.message?.content || "Error generating response";
//         console.log("Generated Story Content:", content);

//         return content;
//     } catch (error) {
//         console.error("Error generating story:", error.message);
//         console.error("Error stack:", error.stack);
//         return "An error occurred while generating the story.";
//     }
// };

// const callApi = async (userMessage, chatLog) => {
//     try {
//         const startTime = Date.now();

//         // Validate userMessage
//         if (!userMessage || typeof userMessage !== 'string') {
//             console.error("Invalid user message:", userMessage);
//             return "Invalid user message.";
//         }

//         // Validate chatLog
//         if (!Array.isArray(chatLog)) {
//             console.error("Invalid chat log:", chatLog);
//             return "Invalid chat log.";
//         }

//         // Format the chat log
//         const formattedMessages = chatLog.map((msg) => ({
//             role: msg.role === "me" ? "user" : msg.role === "gpt" ? "assistant" : msg.role,
//             content: msg.message || msg.content || "",
//         }));

//         // Add the latest user message
//         formattedMessages.push({ role: "user", content: userMessage });

//         console.log("Formatted Messages for API Call:", JSON.stringify(formattedMessages, null, 2));

//         // Call OpenAI API
//         const chatCompletion = await openai.chat.completions.create({
//             model: "ft:gpt-3.5-turbo-1106:personal::8hke3Plj",
//             messages: formattedMessages.concat([
//                 { 
//                     role: 'system', 
//                     content: 'Please focus on helping the user create a story. Tell user that it is not related to story creation and get back in creating children story.' 
//                 }
//             ]),
//             max_tokens: 1000,
//         });

//         // Safely extract content
//         const content = chatCompletion.choices?.[0]?.message?.content;
//         if (!content) {
//             console.error("Invalid or incomplete response from OpenAI API:", chatCompletion);
//             return "An error occurred while fetching data.";
//         }

//         const duration = Date.now() - startTime;
//         console.log(`API call duration: ${duration}ms`);
//         console.log("OpenAI API Response:", JSON.stringify(chatCompletion, null, 2));

//         return content;
//     } catch (error) {
//         console.error("Error during API call:", error.message);
//         console.error("Error stack:", error.stack);
//         return "An error occurred while fetching data.";
//     }
// };

// module.exports = {
//     callApi,
//     generateStory,
// };
