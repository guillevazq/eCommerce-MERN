const router = require("express").Router();
const Account = require("../../../models/Account");
const auth = require("../../../middleware/auth");

// Get all accounts
router.get("/", auth, async (request, response) => {
  try {
    // Getting all the accounts
    const allAccounts = await Account.find({});

    // Returning all of them
    return response.json({accounts: allAccounts});
  } catch (error) {
    return response.json({error: error.message});  
  }
});

module.exports = router;