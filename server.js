const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
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
const { MongoClient, MongoServerError } = require('mongodb');
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

// Check http://localhost:5000/ to see Hello World
app.get("/", function (req, res, next) {
  res.send("Hello world");
});

// TODO: CHANGE TO PROJECT
app.post("/api/login", async (req, res, next) => {
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  var error = "";

  const { username, password } = req.body;

  const db = client.db("POOSD24");
  const results = await db
    .collection("user")
    .find({ Username: username, Password: password })
    .toArray();

  var id = -1;
  var email = "";
  //var fn = '';
  //var ln = '';

  if (results.length > 0) {
    email = results[0].email;
    //id = results[0].ID;
    //fn = results[0].FirstName;
    //ln = results[0].LastName;
  }

  var ret = { id: id, email: email, error: "" };
  res.status(200).json(ret);
});


// User registration
app.post("/api/register", async (req, res, next) => {

  const { firstName, lastName, username, password, email, businessIdList } = req.body;
  const usersCollection = client.db("inventory_tracker").collection("users");

  try {

    const newUser = await usersCollection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password, 
      email: email,
      businessIdList: businessIdList || []
    });

    const createdUser = await usersCollection.findOne(
      { _id: newUser.insertedId },
      { projection: { _id: 0, firstName: 1, businessIdList: 1 } }
    );

    if (createdUser) {
      res.status(201).json({ error: "" });
    } else {
      res.status(404).json({ error: "User not found after registration." });
    }

  } catch (e) {

    if (e instanceof MongoServerError && e.code === 11000) {
      const errorField = e.message.includes('email_1') ? 'Email' : 'Username';
      return res.status(400).json({ error: `${errorField} Taken` });
    }

    console.log(e);
    res.status(500).json({ error: "Server error" });
  } 
});
