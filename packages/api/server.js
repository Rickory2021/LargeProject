require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { connectToServer } = require('./database/databaseManager');
const { DATABASE_URL, PORT } = process.env;

//const path = require('path');
//const PORT = process.env.PORT || 5000;
const app = express();
//app.set("port", (process.env.PORT || 5000));

// middleware 
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

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

// TODO: Fix? 
mongoose.connect(DATABASE_URL)
.then(() => console.log("MongoDB is connected successfully"))
.catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`); 
})
// app.listen(3001);

app.use(cors ({
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true, 
})
);

// Route 
app.use("/", authRoute);


// NOTE: Project connection string 'mongodb+srv://COP4331:POOSD24@cluster0.pwkanif.mongodb.net/'
connectToServer((err) => {
  if (err) console.error(err);
});

// Check http://localhost:5000/ to see Hello World
app.get("/", function (req, res, next) {
  res.send("Hello world");
});

module.exports = app;
