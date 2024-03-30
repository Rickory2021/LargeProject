const User = require('../models/user_model');
const express = require('express');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../util/email'); // Import the sendVerificationEmail function
const { createSecretAccessToken } = require('../util/secret_token');
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison
const { MongoServerError } = require('mongodb');

// Register user endpoint
module.exports.Signup = async (req, res, next) => {
  try {
    const { firstName, lastName, username, password, email, businessIdList } =
      req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const emailVerified = false;

    // Create a new user using the User model
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      password,
      email,
      businessIdList: businessIdList || [],
      emailVerificationToken
    });

    // Send verification email
    await sendVerificationEmail(email, emailVerificationToken);

    // Respond with success
    return res.status(201).json({ error: null, user: newUser });
  } catch (e) {
    console.error(e);
    if (e instanceof MongoServerError && e.code === 11000) {
      const errorField = e.message.includes('email_1') ? 'Email' : 'Username';
      return res.status(400).json({ error: `${errorField} Taken` });
    }
    // Generic error response
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Email verification endpoint
module.exports.VerifyEmail = async (req, res) => {
  const emailVerificationToken = req.query.token;
  console.log(emailVerificationToken);
  try {
    // Find the user with the given email verification token and emailVerified status is false
    const user = await User.findOneAndUpdate(
      { emailVerificationToken, emailVerified: false },
      { emailVerified: true, emailVerificationToken: '' }
    );

    if (user) {
      // Verification successful
      return res.json({ error: '' });
    } else {
      // No matching user found with the token
      return res
        .status(400)
        .json({ error: 'Invalid or expired verification link.' });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred during the verification process.' });
  }
};

// Login user endpoint
module.exports.Login = async (req, res) => {
  // incoming: username, password
  // outgoing: id, firstName, lastName, businessIdList, error
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ error: 'All fields are required' });
    }

    // Find user by username using the User model
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect username or password' });
    }

    // Compare hashed password
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.json({ error: 'Incorrect password' });
    }

    // Generate JWT token for authenticated user
    // Also, set the token as a cookie
    const accessToken = createSecretAccessToken(user._id);
    res.cookie('accessToken', accessToken, {
      withCredentials: true,
      httpOnly: false,
      sameSite: 'None', //cross-site cookie
      maxAge: 6 * 24 * 60 * 60 * 1000
    });

    // Return user details and token
    return res.status(200).json({
      error: null,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      businessIdList: user.businessIdList
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//TODO
// Login user endpoint
module.exports.GetUserInfo = async (req, res) => {
  // incoming: userId
  // outgoing: _id, firstName, lastName, businessIdList, error
  try {
    const { userId } = req.body;

    // Find user by username using the User model
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect userId' });
    }

    // Return user details and token
    return res.status(200).json({
      error: null,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      businessIdList: user.businessIdList
    });
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
