// generateSecretKey.js
// TODO: Not currently in use 

const crypto = require('crypto');

// Generate a random string of specified length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}

// Generate a secret key of length 32 characters (256 bits)
const secretKey = generateRandomString(32);
console.log("Generated Secret Key:", secretKey);
