require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth_route');
const { DATABASE_URL, PORT } = process.env;
const crudRoute = require('./routes/crud_route');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://slicer-project-backend.vercel.app',
      'http://localhost:3001',
      'https://slicer-project.vercel.app'
    ],
    // origin: ['https://large-project-nextjs.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// Connecting to database
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB is connected successfully'))
  .catch(err => console.error(err));

// Route
app.use('/api/auth', authRoute);
app.use('/api/crud', crudRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Check http://localhost:5000/ to see Hello World
app.get('/', function (req, res) {
  res.send(`Server is listening on port ${PORT}`);
});

app.get('/api/:version', function (req, res) {
  res.send(req.params.version);
});

module.exports = app;
