import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [ user, setUser ] = useState([]);

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
                      handleGoogleSubmit(res.data.name || "Anonymous", res.data.email, res.data.verified_email)
                      console.log(res.data)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    const handleGoogleSubmit = async (name, email, verified) => {
      try {
        console.log(name, email)
        const response = await axios.post('http://localhost:5000/api/users/google-login', { name, email, verified });
        console.log(response)
        console
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem("id", response.data._id)
      navigate('/home')
      } catch (error) {
        console.error('Verify error:', error);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      console.log(response)
      localStorage.setItem('id', response.data._id)
      
      navigate('/verify')
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
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button onClick={() => login()}>Sign in with Google 🚀 </button>
    </div>
  );
};

export default Register;
