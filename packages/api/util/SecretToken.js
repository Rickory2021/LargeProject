require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.createSecretToken = _id => {
  return jwt.sign({ _id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60
  });
};
