const User = require('../models/user_model');
const { createSecretToken } = require('../util/secret_token');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { MongoServerError } = require('mongodb');
const { getDatabase } = require('../database/database_manager');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');

// Register user endpoint
module.exports.Signup = async (req, res, next) => {
  try {
    const { firstName, lastName, username, password, email, businessIdList } =
      req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const usersCollection = getDatabase().collection('users');

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ error: 'User already exists' });
    }

    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const emailVerified = false;

    const newUser = await usersCollection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPassword,
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
      return res.status(201).json({ error: null });
      next();
    } else {
      return res
        .status(404)
        .json({ error: 'User not found after registration.' });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof MongoServerError && e.code === 11000) {
      const errorField = e.message.includes('email_1') ? 'Email' : 'Username';
      return res.status(400).json({ error: `${errorField} Taken` });
    }
  }
};

// Email verification endpoint
router.post('/verify-email', async (req, res, next) => {
  const { emailVerificationToken } = req.body;
  const usersCollection = getDatabase().collection('users');

  try {
    const result = await usersCollection.updateOne(
      { emailVerificationToken: emailVerificationToken, emailVerified: false },
      { $set: { emailVerified: true }, $unset: { emailVerificationToken: '' } }
    );

    if (result.modifiedCount === 1) {
      res.json({ error: '' });
    } else {
      res.status(400).json({ error: 'Invalid or expired verification link.' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred during the verification process.' });
  }
});

async function sendVerificationEmail(email, token) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const verificationUrl = `https://slicer-nine.vercel.app/verify-email/${token}`;
  const msg = {
    to: email,
    from: 'xariaadavis@gmail.com', // For testing purposes
    subject: 'Slicer: Verify Your Email',
    html: `<p>Please verify your email by clicking on the link below:</p><a href="${verificationUrl}">Verify Email</a>`
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

// Login user endpoint
module.exports.Login = async (req, res, next) => {
  // incoming: username, password
  // outgoing: id, firstName, lastName, businessIdList, error
  try {
    // Init. error var
    var error = '';
    const { username, password } = req.body;

    // Connect to database
    const db = getDatabase();

    if (!username || !password) {
      return res.json({ error: 'All fields are required' });
    }

    // const user = await User.findOne({ username });
    // connect to database
    const usersCollection = getDatabase().collection('users');

    // Find user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect password or username' });
    }

    // compare hashed password
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.json({ error: 'Incorrect password' });
    }

    // Generate JWT token for authenticated user
    // also set the token as a cookie
    const token = createSecretToken(user._id);
    res.cookie('token', token, {
      withCredentials: true,
      httpOnly: false
    });

    // Return user details and token
    res.status(200).json({
      error: null,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      businessIdList: user.businessIdList
    });
    next();
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Logout user endpoint
module.exports.Logout = async (req, res, next) => {
  try {
    // Clear the token cookie by setting it to an empty value and expiring it
    res.clearCookie('token');

    // Return a success message indicating successful logout
    return res.status(200).json({ error: null });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
