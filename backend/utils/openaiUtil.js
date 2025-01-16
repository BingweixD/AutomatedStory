const OpenAI = require("openai");

// Debug: Log the environment variable (REMOVE THIS IN PRODUCTION)
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing or undefined.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
