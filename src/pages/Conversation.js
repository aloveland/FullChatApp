import React from 'react';
import { useParams } from 'react-router-dom';

const Conversation = () => {
  const { recipient } = useParams();

  return (
    <div>
      <h2>Conversation with {recipient}</h2>
      {/* Add your conversation content here */}
    </div>
  );
};

export default Conversation;
