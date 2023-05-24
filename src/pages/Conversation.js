//import React from 'react';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from './ChatContext';


const Conversation = () => {
  const { recipient } = useParams();
  const { buttonIndex } = useContext(ChatContext);
  console.log("index: ", buttonIndex);
  return (
    <div>
      <h2>Conversation with {recipient}</h2>
      {/* Add your conversation content here */}
    </div>
  );
};

export default Conversation;
