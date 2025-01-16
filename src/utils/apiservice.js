const BASE_URL = 'http://localhost:3080';

// Function to send chat messages to the backend
export const postChatMessage = async (userMessage, chatLog) => {
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage, chatLog }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    return { message: 'Sorry, something went wrong.' };
  }
};

// Function to generate an image based on the prompt
export const generateImage = async (prompt) => {
  try {
    const response = await fetch(`${BASE_URL}/api/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrls; // Assuming the backend returns an array of image URLs
  } catch (error) {
    console.error('Error generating image:', error);
    return [];
  }
};

// Function to generate a PDF
export const generatePDF = async (chatLog) => {
  try {
    const response = await fetch(`${BASE_URL}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatLog }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'storybook.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
