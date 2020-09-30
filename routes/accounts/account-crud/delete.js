const router = require("express").Router();
const Account = require("../../../models/Account");
const auth = require("../../../middleware/auth");

router.delete("/", auth, async (request, response) => {
  // Getting the id
  const {id} = request.user;

  try {
    // Deleting the account
    await Account.findByIdAndDelete(id);

    // Returning the message of a succesfull deletion
    return response.json({message: "Account was deleted succesfully"});

  } catch (error) {
    return response.json({error: error.message});
  }
});

module.exports = router;