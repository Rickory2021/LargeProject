const User = require('../models/user_model');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Check if the user has access to the route by checking if the tokens match
module.exports.userVerification = (req, res) => {
  // Get the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
};
