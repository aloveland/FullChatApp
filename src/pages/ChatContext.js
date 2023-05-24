import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [buttonIndex, setButtonIndex] = useState(null);

  const updateButtonIndex = (index) => {
    setButtonIndex(index);
  };

  return (
    <ChatContext.Provider value={{ buttonIndex, updateButtonIndex }}>
      {children}
    </ChatContext.Provider>
  );
};
