const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const users = require("./src/router/users");

users(app);

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

app.listen(5000); // start Node + Express server on port 5000

// NOTE: Project connection string 'mongodb+srv://COP4331:POOSD24@cluster0.pwkanif.mongodb.net/'
const url = "mongodb+srv://COP4331:POOSD24@cluster0.pwkanif.mongodb.net/";
const { MongoClient, MongoServerError } = require("mongodb");
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

// Check http://localhost:5000/ to see Hello World
app.get("/", function (req, res, next) {
  res.send("Hello world");
});

