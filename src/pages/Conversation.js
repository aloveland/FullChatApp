import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from './ChatContext';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Lambda } from '@aws-sdk/client-lambda';
import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import './styles.css';
import AWS from 'aws-sdk';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const lambdaClient = new Lambda({ region: 'us-east-1' });

const createApiGatewayInstance = (endpoint) => {
 return new AWS.ApiGatewayManagementApi({ endpoint, region: 'us-east-1' });
};


const Conversation = () => {
const { recipient } = useParams();
const { buttonIndex } = useContext(ChatContext);
const [data, setData] = useState(null);
const [messages, setMessages] = useState([]);
const [user, setUser] = useState('');
const chatBoxRef = useRef(null);
const [messageInput, setMessageInput] = useState('');
const [socket, setSocket] = useState(null);
let location = useLocation();
const navigate = useNavigate();
const [messageNum, setMessageNum] = useState(0);


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

useEffect(() => {
  fetchData();
}, [buttonIndex]);
useEffect(() => {
  const createWebSocketConnection = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const conversationId = data; // Replace `data` with the conversationId you want to use

        // Update this line to correctly assign your WebSocket endpoint
        const socketUrl = `wss://if1458js8b.execute-api.us-east-1.amazonaws.com/production?conversationId=${conversationId}`;

        const ws = new WebSocket(socketUrl);

        setSocket(ws);

        ws.addEventListener('open', () => {
          console.log('WebSocket connection established.');
        });

        ws.addEventListener('message', (event) => {
          console.log('Received message:', event.data);

          try {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.sender !== user) {
              setMessages(prevMessages => [
                ...prevMessages,
                receivedMessage,
              ]);
            }
            setMessageNum(prevMessageNum => prevMessageNum + 1);
            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        });



        ws.addEventListener('close', () => {
          console.log('WebSocket connection closed.');
        });

        ws.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
        });
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
      }
    };

    if (data) {
      createWebSocketConnection();
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [data]);

    // ...




const handleInputChange = (event) => {
  setMessageInput(event.target.value);
};

const handleSendMessage = async (convoId) => {
  if (socket && messageInput) {
    try {
      // Retrieve the most recent message number
      const getResponse = await fetch(`https://texdkbns7g.execute-api.us-east-1.amazonaws.com/prod/${convoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        });

      const data = await getResponse.json()
      console.log("MOST RECENT", data);
      const mostRecent = data.mostRecent;

      // Increment the most recent message number
      const newMessageNum = mostRecent + 1;


      // Prepare the message payload
      const messageToSend = {
        action: 'sendMessage',
        convoId: convoId,
        sender: user,
        receiver: recipient,
        message: messageInput,
        messageNum: newMessageNum,
      };

      // Send the message via WebSocket
      socket.send(JSON.stringify(messageToSend));

      // Add the sent message to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageNum: newMessageNum,
          sender: user,
          message: messageInput,
        },
      ]);

      // Clear the message input
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};
;



useEffect(() => {
    const handleUnload = (event) => {
      // Perform actions you need when the page is being unloaded
      console.log("UNLOADING PAGE");
      // To show a confirmation message before closing the page (may not work in all browsers)
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleUnload);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);



  const goBackToChats = async () => {
    navigate('/chat');
  };


return (
  <div>
      <button onClick={goBackToChats} style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer'
      }}>
        Go back to chats
      </button>
    <h2>Conversation with {recipient}</h2>
    <div className="chat-box" ref={chatBoxRef}>
      {messages.map((message) => (
        <div key={message.messageNum} className={`message ${message.sender === user ? 'sent' : 'received'}`}>
          <div className="message-content">{message.message}</div>
        </div>
      ))}
    </div>
    <div className="input-container">
      <input
        type="text"
        className="message-input"
        placeholder="Type your message..."
        style={{ width: 'calc(100% - 53px)' }}
        value={messageInput}
        onChange={handleInputChange}
      />
      <button className="send-button" onClick={() => handleSendMessage(data)}>Send</button>
    </div>
  </div>

);
};

export default Conversation;


