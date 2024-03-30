require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.createSecretAccessToken = _id => {
  return jwt.sign({ userId: _id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60
  });
};

// TODO: Add https://youtu.be/4TtAGhr61VI?si=x-9b8IURnErvyQw4
