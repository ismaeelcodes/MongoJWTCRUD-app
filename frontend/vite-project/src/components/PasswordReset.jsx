import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {

  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const user_id = localStorage.getItem("id")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/setPass', { user_id, password });
      console.log(response)
      
      navigate('/home')
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Enter New Password</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <button type="submit" className="register-button">Set New Password</button>
      </form>
      <Link to='/login'><a>Login</a></Link>
    </div>
  );
};

export default PasswordReset;
