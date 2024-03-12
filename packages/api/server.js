require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectToServer } = require('./src/router/database/databaseManager');

//const path = require('path');
//const PORT = process.env.PORT || 5000;
const app = express();
//app.set("port", (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.listen(3001);

// Route declarations
const userAuthRouter = require("./src/router/auth/userAuth");
app.use('/api/user', userAuthRouter);

const businessAuthRouter = require("./src/router/auth/businessAuth");
app.use('/api/business', businessAuthRouter);

//const userBusinessConnectionRouter = require("./src/router/business/userBusinessConnection");
//app.use('/api/userBusiness', userBusinessConnectionRouter);

/*
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
*/


// NOTE: Project connection string 'mongodb+srv://COP4331:POOSD24@cluster0.pwkanif.mongodb.net/'
connectToServer((err) => {
  if (err) console.error(err);
});

// Check http://localhost:5000/ to see Hello World
app.get("/", function (req, res, next) {
  res.send("Hello world");
});

module.exports = app;
