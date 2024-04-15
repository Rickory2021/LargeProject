const User = require('../../../models/user_model');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Check if the user has access to the route by checking if the tokens match
/**
 * Check if the user has access to the route by checking if the tokens match\
 * - SHOULD BE RUN ON EVERY PAGE TO GET USER ID
 * @param {Request} req  - Incoming: PARAM /AccessTokenString
 * @param {Result} res - The Express response object
 * @returns \{status:true, userId} || {status: false}
 */
module.exports.userVerification = (req, res) => {
  // Get the token from the cookie
  const token = req.params.accessToken;
  console.log(`Token: ${token}`);

  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.userId);
      if (user) return res.json({ status: true, userId: data.userId });
      else return res.json({ status: false });
    }
  });
};
