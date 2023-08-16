// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/auth');
const { MongoClient, ObjectId } = require('mongodb');
const { decode } = require('jsonwebtoken');

const uri = 'mongodb+srv://workwithismaeel:SsoQi2hFygyn1qux@cluster0.ydnqoor.mongodb.net/yourDBName?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

router.post('/tasks', async (req, res) => {
  const token = req.header('Authorization');
  const decodedToken = verifyToken(token);
  console.log(decodedToken)
  console.log(token)
  if (!decodedToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { title, description } = req.body;
  const userId = new ObjectId(decodedToken.id);

  try {
    await client.connect();
    const task = { 
        userId, 
        title, 
        description, 
        completed: false 
    };
    const result = await client.db('crudatabase').collection('tasks').insertOne(task);
    res.json(result.ops[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

router.get('/tasks', async (req, res) => {
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token);
  
    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      await client.connect();
      const tasks = await client.db('crudatabase').collection('tasks').find({ userId: ObjectId(decodedToken.id) }).toArray();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      await client.close();
    }
  });


module.exports = router;
