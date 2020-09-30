const auth = require("../../middleware/auth");
const ItemOffered = require("../../models/ItemOffered");
const router = require("express").Router();

// Getting all the items being sold by the logged in user
router.get("/current-user", auth, async (request, response) => {
  // Getting the id from the middleware
  const {id} = request.user;

  try {
    // Getting the all the items posted by a user
    const itemsUser = await ItemOffered.find({ownerID: id});

    // Returning the items
    return response.json({items: itemsUser});
  } catch (error) {
    return response.json({error: error.message});
  }
});

// Getting all the items (Not private, the user doesn't have to be logged in)
router.get("/all-items", async (request, response) => {
  try {
    // Getting all the items 
    const allItems = await ItemOffered.find({});

    // Returning all the items
    return response.json({items: allItems});
  } catch (error) {
    return response.json({error: error.message});
  }
});

module.exports = router;
