import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [ user, setUser ] = useState([]);
  const _id = localStorage.getItem("id")

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                    handleGoogleSubmit(res.data.email, _id)
                      
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  const handleGoogleSubmit = async (email, _id) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/google-login-verify', { email, _id });
      localStorage.setItem("accessToken", response.data.accessToken)
      console.log(response)
    navigate('/home')
    } catch (error) {
      console.error('Verify error:', error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem("accessToken", response.data.accessToken)
      navigate('/home')
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <Link to='/forgetPass'><a>Forgot Password?</a></Link>
      <button onClick={() => login()}>Sign in with Google 🚀 </button>
    </div>
    </>
  );
};

export default Login;
