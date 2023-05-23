import React, { useState, useEffect } from 'react';

const Chat = () => {
 const [recipients, setRecipients] = useState([]);

 useEffect(() => {
   const fetchRecipients = async () => {
     try {
       const response = await fetch('https://qrgoln7et8.execute-api.us-east-1.amazonaws.com/prod', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ convoIds: ['123', '1234'], sender: 'ajlovelandwater@gmail.com' })
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
   };

   fetchRecipients();
 }, []);

 const handleConversationClick = (email) => {
   // handle logic for opening conversation here
   console.log(`Opening conversation with ${email}`);
 };

 const conversationBoxStyle = {
   border: '1px solid #ddd',
   marginBottom: '10px',
   padding: '10px',
   cursor: 'pointer',
   borderRadius: '5px'
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
   transitionDuration: '0.4s'
 };

 return (
   <div>
     {recipients.map((email, index) => (
       <div
         key={index}
         style={conversationBoxStyle}
       >
         <button
           style={buttonStyle}
           onClick={() => handleConversationClick(email)}
           onMouseOver={(e) => e.target.style.backgroundColor = '#4CAF50'}
           onMouseOut={(e) => e.target.style.backgroundColor = '#008CBA'}
         >
           Conversation with {email}
         </button>
       </div>
     ))}
   </div>
 );
};

export default Chat;

