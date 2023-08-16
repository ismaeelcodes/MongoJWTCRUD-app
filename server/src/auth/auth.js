const jwt = require('jsonwebtoken');
const secretKey = 'wunpeace';

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token) => {
  console.log(token)
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
