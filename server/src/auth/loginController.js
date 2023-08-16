const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateToken } = require('./auth');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://workwithismaeel:SsoQi2hFygyn1qux@cluster0.ydnqoor.mongodb.net/yourDBName?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Retrieve user from MongoDB
  const user = await client.db('crudatabase').collection('users').findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare passwords using bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;
