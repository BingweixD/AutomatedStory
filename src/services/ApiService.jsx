const BASE_URL = 'http://localhost:3080/api';

export const postChatMessage = async (userMessage, chatLog) => {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage, chatLog }),
  });
  return response.json();
};

export const generateImage = async (prompt) => {
  const response = await fetch(`${BASE_URL}/chat/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
};

export const generatePDF = async (chatLog, imageUrl, pages) => {
  const response = await fetch(`${BASE_URL}/chat/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatLog, imageUrl, pages }),
  });
  return response.blob();
};
