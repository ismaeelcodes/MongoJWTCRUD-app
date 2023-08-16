const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { generateToken } = require('./auth/auth');
const cors = require('cors')
const port = 5000; 

const corsOptions ={
    origin:'http://127.0.0.1:5173', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


app.use(express.json());


const uri = 'mongodb+srv://workwithismaeel:SsoQi2hFygyn1qux@cluster0.ydnqoor.mongodb.net/yourDBName?retryWrites=true&w=majority'; // Your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});


const loginController = require('./auth/loginController');
const registerController = require('./auth/registerController');
const taskRoutes = require('./routes/taskRoutes')

app.use('/api', loginController);
app.use('/api', registerController);
app.use('/api', taskRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

