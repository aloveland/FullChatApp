import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from './ChatContext';
import { Auth } from 'aws-amplify'; // Import the necessary authentication library

const Conversation = () => {
  const { recipient } = useParams();
  const { buttonIndex } = useContext(ChatContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser(); // Get the authenticated user
        const response = await fetch(`https://8lujstom26.execute-api.us-east-1.amazonaws.com/prod/${encodeURIComponent(user.attributes.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseData = await response.json();
        setData(responseData.convoIds[buttonIndex]);
        console.log("data: ", responseData.convoIds[buttonIndex]);
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    fetchData();
  }, [buttonIndex]);

  return (
    <div>
      <h2>Conversation with {recipient}</h2>
      {/* Add your conversation content here */}
    </div>
  );
};

export default Conversation;
