// Importing JSON Web Tokens
const jwt = require("jsonwebtoken");

// Importing Config (Global Variables)
const config = require("../config/secrets");

module.exports = (request, response, next) => {
  // Get Token From Header
  const token = request.header("x-auth-token");

  // Check if there isn't token
  if (!token) {
    return response.status(401).json({message: "No token authorisation, denied"});
  }

  try {
    // Decoding the token
    const decoded = jwt.verify(token, config.secret);

    // Getting info from token
    request.user = decoded.user;
    next();
  } catch (err) {
    response.status(401).json({message: "Token is not valid"});
  }
}