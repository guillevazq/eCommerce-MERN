const router = require("express").Router();
const auth = require("../../../middleware/auth");
const Account = require("../../../models/Account");

router.put("/", auth, async (request, response) => {
  // Getting the information from the request
  const {name, email} = request.body;
  try {
    // Getting the account being edited
    const accountBeingEdited = await Account.findById(request.user.id);

    // If there aren't any arguments
    if (!name && !email) {
      return response.json({message: "No arguments detected"});
    }

    // If there is a name, then change it
    if (name) {
      accountBeingEdited.name = name;
    } 

    // If there is an email, then change it
    if (email) {
      // Checking if email is already in database with another account
      const emailAccountAlreadyExistant = await Account.find({email});
      if (emailAccountAlreadyExistant.length !== 0) {
        return response.json({error: "Account already exists"});
      } else {
        // Changing the email
        accountBeingEdited.email = email;
      }
    }

    // Saving the changes
    await accountBeingEdited.save();
    
    // Returning the account with the changes saved
    return response.json({account: accountBeingEdited});
  } catch (error) {
    return response.json({error: error.message});
  }
});

module.exports = router;