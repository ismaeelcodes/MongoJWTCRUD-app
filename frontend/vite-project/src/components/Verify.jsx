import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate()
  const user_id = localStorage.getItem("id")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("before")
        console.log(user_id, otp)
      const response = await axios.post('http://localhost:5000/api/users/verifyOTP', { user_id, otp });
      console.log(response)
      localStorage.setItem("accessToken", response.data.accessToken)
      navigate('/home')
    } catch (error) {
      console.error('Verify error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Verify</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          className="register-input"
        />
        
        <button type="submit" className="register-button">Verify</button>
      </form>
      <Link to='/'><a>Go Back to the Register Page</a></Link>
    </div>
  );
};

export default Verify;
