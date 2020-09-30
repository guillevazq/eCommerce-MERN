const config = require("../../config/secrets");
const Account = require("../../models/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const router = require("express").Router();

router.post("/", [
  // Checking if there required forms are being submitted
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").not().isEmpty()
], async (request, response) => {
  // Checking if there are any errors, if so, returning them
  const errors = validationResult(request).array();
  if (errors.length !== 0) {
    return response.json({error: errors});
  }

  // Getting the email and password, and checking if they're strings, if not, returning an error
  const {email, password} = request.body;
  if (typeof email !== "string" || typeof password !== "string") {
    return response.json({error: "Invalid data type: String required"});
  }
  try {
    // Checking if account exists
    const doesAccountExist = await Account.findOne({email});
    if (!doesAccountExist) {
      return response.json({emailError: "Account doesn't exist"});
    }
    // Checking if the password is correct
    const passwordIsCorrect = await bcrypt.compare(password, doesAccountExist.password);
    if (!passwordIsCorrect) {
      return response.json({passwordError: "Incorrect password"});
    }
    // Returning the JSON Web Token
    const payload = {
      user: {
        id: doesAccountExist._id
      }
    }
    const token = await jwt.sign(payload, config.secret, {expiresIn: 3600000});
    return response.json({token});
  } catch (error) {
    return response.json({error: error.message});
  }
});

module.exports = router;