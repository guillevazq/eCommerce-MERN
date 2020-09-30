const router = require("express").Router();
const ItemOffered = require("../../models/ItemOffered");
const auth = require("../../middleware/auth");
const checkIfAuthenticated = require("../../utilities/getAuthenticated");

router.put("/edit/:id", auth, async (request, response) => {
  // Checking if the user is authenticated
  const isAuthenticated = await checkIfAuthenticated(request.user.id); 
  if (!isAuthenticated) {
    return response.json({error: "The user is not authenticated (has not verified his email)"});
  }
  
  // Getting the ID from the url
  const {id} = request.params; 
  try {
    // Getting the item the user is trying to edit
    const itemBeingEdited = await ItemOffered.findById(id);

    // If there's not such item with that id then return an error
    if (!itemBeingEdited) {
      return response.json({error: "Item not found"});
    }

    // Checking if the item is the users property
    if (itemBeingEdited.ownerID !== request.user.id) {
      return response.json({error: "The item is not of the users property"});
    }

    // Getting the data from the request
    const {title, description, price, image, size, brand, colorway, retailPrice, releaseDate} = request.body;

    const requestedValues = [title, description, price, image, size, brand, colorway, retailPrice, releaseDate];
    const nameOfValues = ["title", "description", "price", "image", "size", "brand", "colorway", "retailPrice", "releaseDate"]

    for (let x = 0; x < nameOfValues.length; x++) {
      if (requestedValues[x]) {
        itemBeingEdited[nameOfValues[x]] = requestedValues[x];
      }
    }

    await itemBeingEdited.save();
    return response.json({item: itemBeingEdited});

  } catch (error) {
    return response.json({error: error.message});  
  }
});

module.exports = router;