import './styles/normal.css';
import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css'; // Adjust the path based on where your App.css is located.


function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatlog] = useState([
    {
      role: 'gpt',
      message:
        "Let's craft and create a children's story step by step! Share some key details to get started:\n 1. Setting: Describe the story's location and time.\n2. Characters: Introduce the main characters, their traits, and any special abilities.\n3. Plot: Outline the main events and challenges.\n4. Theme: What's the story's moral or message?\n5. Visual Elements: Highlight any scenes or elements for illustrations.\n\nAdd any extra details for your story. After planning, choose an art style for the illustrations. Consider styles or artists that inspire you for the artwork (e.g., watercolor, digital). \n6. Generate the full cohesive story with title based on the discussion.",
    },
  ]);
  const [requestedPages, setRequestedPages] = useState(1);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setChatlog((prevChatLog) => [...prevChatLog, { role: 'user', message: userMessage }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage, chatLog }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setChatlog((prevChatLog) => [...prevChatLog, { role: 'gpt', message: data.message }]);
    } catch (error) {
      console.error('Error handling form submission:', error);
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        { role: 'gpt', message: "Sorry, I'm having trouble processing that request." },
      ]);
    }
  };

  const handleGenerateImage = async () => {
    const lastMessage = chatLog[chatLog.length - 1].message;
    if (!lastMessage) {
      console.error('No last message available for image generation.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3080/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: lastMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const imageUrls = data.imageUrls;
      if (imageUrls && imageUrls.length > 0) {
        const imageMessages = imageUrls.map((url) => ({ role: 'gpt', message: `Image URL: ${url}` }));
        setChatlog((prevChatLog) => [...prevChatLog, ...imageMessages]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const generatePDFWithPages = async () => {
    const lastEntry = chatLog[chatLog.length - 1];
    const imageUrl = lastEntry.role === 'gpt' ? lastEntry.message.replace('Image URL: ', '') : null;

    try {
      const response = await fetch('http://localhost:3080/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatLog, imageUrl, requestedPages }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'storybook.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-button">
          <span>+</span> New Chat
        </div>
      </aside>

      <section className="chatbox">
        <div className="chat-log" ref={chatLogRef}>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <button onClick={handleGenerateImage}>Generate Image</button>
          <input
            type="number"
            value={requestedPages}
            onChange={(e) => setRequestedPages(e.target.value)}
            placeholder="Number of Pages"
            className="page-input"
          />
          <button onClick={generatePDFWithPages}>Generate PDF with Pages</button>

          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
              placeholder="Type your message here"
            />
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  const textMessage = message.message || message;
  const isImage = typeof textMessage === 'string' && textMessage.startsWith('Image URL: ');
  const imageUrl = isImage ? textMessage.replace('Image URL: ', '') : null;

  const content = isImage ? <img src={imageUrl} alt="Generated" /> : <div>{textMessage}</div>;

  return (
    <div className={`chat-message ${message.role === 'gpt' ? 'chatgpt' : 'chatuser'}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.role === 'gpt' ? 'chatgpt' : 'chatuser'}`}></div>
        <div className="message">{content}</div>
      </div>
    </div>
  );
};

export default App;
