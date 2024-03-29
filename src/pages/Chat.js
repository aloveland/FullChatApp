import React, { useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from './ChatContext';

const Chat = () => {
  const [recipients, setRecipients] = useState([]);
  const [newConversation, setNewConversation] = useState(false);
  const navigate = useNavigate();
  const { updateButtonIndex } = useContext(ChatContext);

  useEffect(() => {
    const fetchRecipients = async () => {
      const session = await Auth.currentSession();
      const user = session.getIdToken().payload.email;
      console.log("user:", user);
      try {
        const getResponse = await fetch(`https://8lujstom26.execute-api.us-east-1.amazonaws.com/prod/${encodeURIComponent(user)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const getData = await getResponse.json();
        console.log("GET REQ, ", getData.convoIds);
        try {
          const response = await fetch('https://qrgoln7et8.execute-api.us-east-1.amazonaws.com/prod', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ convoIds: getData.convoIds, sender: user })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          console.log("data is HERE", data);
          setRecipients(data.recipients || []);
        } catch (error) {
          console.error('Error fetching recipients:', error);
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    if (!newConversation) {
      fetchRecipients();
    }
  }, [newConversation]);

  const handleConversationClick = (email, index) => {
    // handle logic for opening conversation here
    console.log(`Opening conversation with ${email}`);
    console.log(`Button index: ${index}`);
    updateButtonIndex(index);
    navigate(`/Conversation/${encodeURIComponent(email)}`);
  };

  const handleStartNewConversation = () => {
    // handle logic for starting a new conversation here
    console.log('Starting new conversation');
    setNewConversation(true);
  };

  const chatContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    paddingTop: '20px',
  };

  const conversationBoxStyle = {
    border: '1px solid #ddd',
    marginBottom: '10px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
  };

  const buttonStyle = {
    backgroundColor: '#008CBA',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
    transitionDuration: '0.4s',
  };

  if (newConversation) {
    return (
      <div style={chatContainerStyle}>
        <h2>Enter recipient email</h2>
        <input type="text" />
        <button
          style={buttonStyle}
          onClick={handleStartNewConversation}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#008CBA')}
        >
          Start New Conversation
        </button>
      </div>
    );
  }

  return (
    <div style={chatContainerStyle}>
      <button
        style={buttonStyle}
        onClick={handleStartNewConversation}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#4CAF50')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#008CBA')}
      >
        Start New Conversation
      </button>
      {recipients.map((email, index) => (
        <div key={index} style={conversationBoxStyle}>
          <button
            style={buttonStyle}
            onClick={() => handleConversationClick(email, index)}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#4CAF50')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#008CBA')}
          >
            Conversation with {email}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Chat;
