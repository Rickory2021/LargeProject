const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser")
const cors = require("cors");

router.post("/api/login", async (req, res, next) => {
  // incoming: username, password
  // outgoing: id, firstName, lastName, businessIdList, error

  // Init. error var
  var error = "";
  const { username, password } = req.body;

  // Connect to database
  const db = client.db("inventory_tracker");

  try {
    // In users collection, find the username and password record that matches the incoming user and password
    const results = await db
      .collection("users")
      .find({ username: username, password: password })
      .toArray();

    // instantiate variables to store the results found in the database that we want to send back(id, fn, and ln)
    var id = -1;
    var fn = "";
    var ln = "";
    var email = "";
    var bId = [];

    // if results found, obtain from array and store in the init. variables
    if (results.length > 0) {
      id = results[0]._id;
      fn = results[0].firstName;
      ln = results[0].lastName;
      email = results[0].email;
      bId = results[0].businessIdList;

      // Return what we just stored in our vars, id, fn, ln
      var ret = {
        _id: id,
        firstName: fn,
        lastName: ln,
        email: email,
        businessIdList: bId,
        error: "",
      };
      return res.status(200).json(ret);
    }

    // User not found
    var ret = { error: "User not found/incorrect username or password" };
    return res.status(401).json(ret);
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// User registration
router.post("/api/register", async (req, res, next) => {
  const { firstName, lastName, username, password, email, businessIdList } =
    req.body;
  const usersCollection = client.db("inventory_tracker").collection("users");

  try {
    const newUser = await usersCollection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      businessIdList: businessIdList || [],
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
      const errorField = e.message.includes("email_1") ? "Email" : "Username";
      return res.status(400).json({ error: `${errorField} Taken` });
    }

    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/api/registerBusiness", async (req, res, next) => {
  // incoming: businessName
  // outgoing: businessId, error

  // Init. error var
  var error = "";
  const { businessName } = req.body;

  // Connect to database
  const db = client.db("inventory_tracker");

  try {
    // Create a new business object
    const result = await db.collection("businesses").insertOne({
      businessName: businessName,
      employeeIdList: [],
      itemList: [],
      distributorList: [],
    });

    // Extract the inserted business ID
    const businessId = result.insertedId;

    // Return the business ID and no error
    return res.status(200).json({ businessId, error: "" });
  } catch (error) {
    console.error("Error during business registration:", error);

    // Return an empty business ID and an error message
    return res.status(500).json({ businessId: "", error: "Unknown Error" });
  }
});

module.exports = function (app) {
  app.use('/users', router);
}



