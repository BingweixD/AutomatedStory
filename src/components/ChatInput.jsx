import React from 'react';

const ChatInput = ({ input, setInput, onSubmit }) => (
  <form onSubmit={onSubmit} className="chat-input-holder">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="chat-input-textarea"
      placeholder="Type your message here"
    />
  </form>
);

export default ChatInput;
