import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const token = response.data.token;

      // Store token in localStorage or state for future API requests
      localStorage.setItem('token', token);

      navigate('/home')
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <Link to='/'><a>Register</a></Link>
    </div>
  );
};

export default Login;
