import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
//import Chat from './ChatApp';


function App() {
  return (
    <div className="App">
      <h1>Demo Chat App</h1>
      <Router>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/Chat" element={<Chat />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
