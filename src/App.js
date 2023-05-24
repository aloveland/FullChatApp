import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Conversation from './pages/Conversation';
import { ChatProvider } from './pages/ChatContext';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Demo Chat App</h1>
      </div>
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Conversation/:recipient" element={<Conversation />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
