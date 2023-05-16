import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <h1>Demo Chat App</h1>
      <Router>
          <Routes>
            <Route path="/" element={<Login />}></Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
