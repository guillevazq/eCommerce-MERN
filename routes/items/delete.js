const router = require("express").Router();
const auth = require("../../middleware/auth");
const ItemOffered = require("../../models/ItemOffered");
const checkIfAuthenticated = require("../../utilities/getAuthenticated");

// Deleting a specific item
router.delete("/:id", auth, async (request, response) => {
  // Getting the id from the url
  const {id} = request.params;

  try {
    // Checking if the user is authenticated
    const isAuthenticated = await checkIfAuthenticated(request.user.id); 
    if (!isAuthenticated) {
      return response.json({error: "The user is not authenticated (has not verified his email)"});
    }
    
    // Getting the item
    const itemBeingDeleted = await ItemOffered.findById(id);
    
    // Checking if the item exists
    if (!itemBeingDeleted) {
      return response.json({error: "Item does not exist"});
    }

    // Checking if the item belongs to the user
    if (itemBeingDeleted.ownerID !== request.user.id) {
      return response.json({error: "Item does not belong to the user"});
    }

    // Deleting the item
    await ItemOffered.deleteOne({_id: id});

    // Returning the message of the item being deleted
    return response.json({message: "Item was deleted"});

  } catch (error) {
    return response.json({error: error.message});
  }
});

// Deleting all the items of a user (In case of account deletion)
router.delete("/all/user", auth, async (request, response) => {
  try {
    // Delete items that have the user id
    await ItemOffered.deleteMany({ownerID: request.user.id});
    
    // Returning a success message
    return response.json({message: "All items of user were deleted"});
  } catch (error) {
    return response.json({error: error.message});  
  }
});

module.exports = router;