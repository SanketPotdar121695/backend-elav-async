const cors = require('cors');
const express = require('express');
const { connection, PORT } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const { postRouter } = require('./routes/post.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media API!');
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.log('Something went wrong with MongoDB!');
    console.log({ error: err.message });
  }
  console.log(`App is running on port ${PORT}`);
});
