import React from 'react';
import ChatMessage from './ChatMessage';

const ChatLog = ({ chatLog }) => (
  <div className="chat-log">
    {chatLog.map((message, index) => (
      <ChatMessage key={index} message={message} />
    ))}
  </div>
);

export default ChatLog;
