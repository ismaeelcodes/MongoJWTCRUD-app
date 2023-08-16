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

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await client.db('crudatabase').collection('users').findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password
  const number = 10;
  const hashedPassword = await bcrypt.hash(password, number);

  // Create a new user
  const newUser = {
    username,
    password: hashedPassword,
  };

  // Insert the user into the database
  await client.db('crudatabase').collection('users').insertOne(newUser);

  // Generate a JWT token
  const token = generateToken(newUser);
  res.json({ token });
});

module.exports = router;
