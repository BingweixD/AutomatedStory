import React from 'react';

const ChatMessage = ({ message }) => {
  const textMessage = message.message || message;
  const isImage = typeof textMessage === 'string' && textMessage.startsWith('Image URL: ');
  const imageUrl = isImage ? textMessage.replace('Image URL: ', '') : null;

  const formatMessage = (text) => {
    return text.split('\n').map((item, index) => (
      <p key={index}>
        {item.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={idx}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    ));
  };

  return (
    <div className={`chat-message ${message.role === 'gpt' ? 'chatgpt' : 'chatuser'}`}>
      <div className={`avatar ${message.role === 'gpt' ? 'chatgpt' : 'chatuser'}`} />
      <div className="message">
        {isImage ? <img src={imageUrl} alt="Generated" /> : <div>{formatMessage(textMessage)}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
