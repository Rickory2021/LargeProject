const express = require("express");
const router = express.Router();
const { MongoServerError } = require("mongodb");
const { getDatabase } = require('../database/databaseManager');
const crypto = require('crypto')
const sendgrid = require('@sendgrid/mail')

router.post("/login", async (req, res, next) => {
    // incoming: username, password
    // outgoing: id, firstName, lastName, businessIdList, error
  
    // Init. error var
    var error = "";
    const { username, password } = req.body;
  
    // Connect to database
    const db = getDatabase();
  
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
router.post("/register", async (req, res, next) => {
    const { firstName, lastName, username, password, email, businessIdList } =
        req.body;
    const usersCollection = getDatabase().collection("users");

    try {

        const emailVerificationToken = crypto.randomBytes(20).toString('hex')
        const emailVerified = false

        const newUser = await usersCollection.insertOne({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            businessIdList: businessIdList || [],
            emailVerified,
            emailVerificationToken
        });

        const createdUser = await usersCollection.findOne(
            { _id: newUser.insertedId },
            { projection: { _id: 0, firstName: 1, businessIdList: 1 } }
        );

        await sendVerificationEmail(email, emailVerificationToken);

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

router.post('/verify-email', async (req, res, next) => {
  
  const { emailVerificationToken } = req.body;
  const usersCollection = getDatabase().collection("users");

  try {

    const result = await usersCollection.updateOne(
      { emailVerificationToken: emailVerificationToken, emailVerified: false },
      { $set: { emailVerified: true }, $unset: { emailVerificationToken: "" } }
    );

    if (result.modifiedCount === 1) {
      res.json({ error: "" });
    } else {
      
      res.status(400).json({ error: "Invalid or expired verification link." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the verification process." });
  }
});

async function sendVerificationEmail(email, token) {

  // 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
  sendgrid.setApiKey('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');

  const verificationUrl = `https://slicer-nine.vercel.app/verify-email/${token}`;
  const msg = {
      to: email,
      from: 'xariaadavis@gmail.com', // For testing purposes
      subject: 'Slicer: Verify Your Email',
      html: `<p>Please verify your email by clicking on the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
      await sendgrid.send(msg);
      console.log('Verification email sent successfully.');
  } catch (error) {
      console.error('Error sending verification email:', error);

      // TODO: 
      throw new Error('Failed to send verification email.'); 
  }
}

module.exports = router;