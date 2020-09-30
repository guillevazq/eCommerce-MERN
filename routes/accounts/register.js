const Account = require("../../models/Account");
const config = require("../../config/secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const router = require("express").Router();

router.post("/", [
  // Checking all the required fields
  check("name", "Please insert a valid name").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "The password has to have at least 5 characters").isLength({min: 6}),
  check("isAuthenticated", "Please include a true or false statement").isBoolean(),
  check("admin", "Please include a valid admin state").isBoolean()
], async (request, response) => {
  // Returning errors if there are any
  const errors = validationResult(request).array();
  if (errors.length !== 0) {
    return response.json({error: errors});
  }

  // Getting the name, email and password from the request
  const {name, email} = request.body;
  let {password} = request.body;

  // Checking if the fields submitted are strings, if not, returning an error
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return response.json({error: "Name, email or password are not strings"});
  }
  try {
    // Finding account with the same email to see if it exists already
    const accountWithSameEmail = await Account.findOne({email});
    if (accountWithSameEmail) {
      return response.json({emailError: "Account already exists"});
    }
    
    // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Defining the default verification email and the admin state (False)
    const isAuthenticated = false;
    const admin = false;

    // Saving the user to the database
    const newUser = await new Account ({name, email, password, isAuthenticated, admin});
    await newUser.save();

    // Returning the jsonwebtoken
    const payload = {
      user: {
        id: newUser._id
      }
    }
    const token = await jwt.sign(payload, config.secret, ({expiresIn: "24h"}));
    return response.json({token});
  } catch (error) {
    return response.json({error});
  }
});

module.exports = router;