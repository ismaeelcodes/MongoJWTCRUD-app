import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      const token = response.data.token;

      // Store token in localStorage or state for future API requests
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      <Link to='/login'><a>Login</a></Link>
    </div>
  );
};

export default Register;
