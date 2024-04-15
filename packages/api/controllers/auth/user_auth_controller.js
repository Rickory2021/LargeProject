const User = require('../../models/user_model');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../../util/email'); // Import the sendVerificationEmail function
const { createSecretAccessToken } = require('../../util/secret_token');
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison
const { MongoServerError } = require('mongodb');

/**
 * Register user endpoint\
 * - Creates the new User Account (No Login) & Sends Email Verification
 * @param {Request} req Incoming: JSON {firstName, lastName, username, password, email, businessIdList}
 * @param {Result} res The Express response object.
 * @returns \{error:null, user:{firstName, lastName, username, password, email, businessIdList, emailVerificationToken}}
 * || {error:'${email} Taken'} || {error:'${username} Taken'} || {error:'Internal server error'}
 */
module.exports.Signup = async (req, res) => {
  try {
    const { firstName, lastName, username, password, email, businessIdList } =
      req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const emailVerificationToken = crypto.randomBytes(20).toString('hex');

    // Create a new user using the User model
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      password,
      email,
      businessIdList: businessIdList || [],
      emailVerificationToken,
      emailVerified: false
    });

    // Send verification email
    await sendVerificationEmail(email, emailVerificationToken);

    // Respond with success
    return res.status(201).json({ error: null, user: newUser });
  } catch (e) {
    if (e instanceof MongoServerError && e.code === 11000) {
      const errorField = e.message.includes('email_1') ? 'Email' : 'Username';
      return res.status(400).json({ error: `${errorField} Taken` });
    }
    // Generic error response
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Email verification endpoint\
 * - Given Email Token, will attempt to Verify User's Email\
 * - emailVerificationToken:token => ''\
 * - emailVerified:false => true
 * @param {Request} req Incoming: QUERY ?token
 * @param {Result} res The Express response object.
 * @returns \{error:null} || {error:'Invalid or expired verification link.'} || {error:'An error occurred during the verification process.'}
 */
module.exports.VerifyEmail = async (req, res) => {
  const emailVerificationToken = req.query.token;
  try {
    // Find the user with the given email verification token and emailVerified status is false
    const user = await User.findOneAndUpdate(
      { emailVerificationToken, emailVerified: false },
      { emailVerified: true, emailVerificationToken: '' }
    );

    if (user) {
      // Verification successful
      return res.json({ error: null });
    } else {
      // No matching user found with the token
      return res
        .status(400)
        .json({ error: 'Invalid or expired verification link.' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred during the verification process.' });
  }
};

/**
 * Login user endpoint\
 * - Login if Username & Password is Correct & Email Verified\
 * - Initialize SecretAccessToken for Middleware
 * @param {Request} req Incoming: JSON{username, password}
 * @param {Result} res The Express response object.
 * @returns \{error:null,userId,firstName,lastName,username,email,businessIdList,accessToken}, Cookie{userId, AccessToken} || {error:'All fields are required'} || {error:'Incorrect username'}
 * || {error:'Incorrect password'} {error:'Email not Verified'}|| {error:'Internal Server Error'}
 */
module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user by username using the User model
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect username' });
    }

    // Compare hashed password
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ error: 'Email not Verified' });
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
      businessIdList: user.businessIdList,
      accessToken: accessToken
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get User Info endpoint\
 * - Given UserId, return all information of User
 * @param {Request} req Incoming: QUERY ?userId
 * @param {Result} res The Express response object.
 * @returns \{error:null, userId, firstName, lastName, username, email, businessIdList} || {error:'Incorrect userId'} || {error:'Internal Server Error'}
 */
module.exports.GetUserInfo = async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(userId);

    // Find user by username using the User model
    const user = await User.findOne({ _id: userId });
    console.log(user);

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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Logout user endpoint\
 * - Remove the Cookie that is used for Authentification
 * @param {Request} req Incoming: NULL
 * @param {Result} res The Express response object.
 * @returns \{error:null} || {error:'Internal Server Error'}
 */
module.exports.Logout = async (req, res) => {
  try {
    // Clear the token cookie by setting it to an empty value and expiring it
    res.clearCookie('token');

    // Return a success message indicating successful logout
    return res.status(200).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
