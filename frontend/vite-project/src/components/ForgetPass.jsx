import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/forgetPass', { email });
      console.log(response)
      localStorage.setItem('id', response.data._id)
      navigate('/verifyreset')
    } catch (error) {
      console.error('Verify error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Forgott Password</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        
        <button type="submit" className="register-button">Verify</button>
      </form>
      <Link to='/login'><a>Go Back to the Login Page</a></Link>
    </div>
  );
};

export default ForgetPass;
