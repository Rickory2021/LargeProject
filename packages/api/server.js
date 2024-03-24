require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth_route');
const { DATABASE_URL, PORT } = process.env;

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(
  cors({
    origin: ['http://localhost:' + PORT],
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Check http://localhost:5000/ to see Hello World
app.get('/', function (req, res, next) {
  res.send(`Server is listening on port ${PORT}`);
});

module.exports = app;
