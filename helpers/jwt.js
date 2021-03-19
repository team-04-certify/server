const jwt = require("jsonwebtoken");

function createToken(obj) {
  return jwt.sign(obj, process.env.SECRET_KEY);
}

module.exports = { createToken };
