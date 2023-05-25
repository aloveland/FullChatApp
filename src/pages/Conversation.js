import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from './ChatContext';
import { Auth } from 'aws-amplify';
import './styles.css';

const Conversation = () => {
  const { recipient } = useParams();
  const { buttonIndex } = useContext(ChatContext);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const email = currentUser.attributes.email;
        setUser(email);

        const response = await fetch(`https://8lujstom26.execute-api.us-east-1.amazonaws.com/prod/${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseData = await response.json();
        setData(responseData.convoIds[buttonIndex]);

        const Convoresponse = await fetch(`https://6hc2xaelmc.execute-api.us-east-1.amazonaws.com/prod/${responseData.convoIds[buttonIndex]}/${1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const convoData = await Convoresponse.json();
        setMessages(convoData.messages || []);

        // Scroll to the bottom of the chat box
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [buttonIndex]);

  return (
    <div>
      <h2>Conversation with {recipient}</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message) => (
          <div key={message.messageNum} className={`message ${message.sender === user ? 'sent' : 'received'}`}>
            <div className="message-content">{message.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversation;
