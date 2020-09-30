const router = require("express").Router();
const checkIfAuthenticated = require("../../utilities/getAuthenticated");
const ItemOffered = require("../../models/ItemOffered");
const Account = require("../../models/Account");
const mongoose = require("mongoose");
const {check, validationResult} = require("express-validator");
const auth = require("../../middleware/auth");

// Registering a new item
router.post("/", [auth, [
  check("title", "Please include a title of at least 2 characters").isLength({min: 2}).isString(),
  check("description", "Please include a valid description of at least 50 characters, and a max of 500 characters").isLength({min: 50, max: 500}).isString(),
  check("price", "Please include a valid price").isLength({max: 8}).isNumeric(),
  check("image", "Please include a valid URL of an image").isString(),
  check("size", "Please include a valid size").isLength({min: 1, max: 20}).isString(),
  check("brand", "Please include a valid brand").isLength({min: 2, max: 25}).isString(),
  check("colorway", "Please include a valid colorway").isLength({min: 1, max: 30}).isString(),
  check("retailPrice", "Please include a valid retail price").isLength({min: 1, max: 8}).isNumeric(),
  // CHANGE TO DATE
  check("releaseDate", "Please include a valid release date").isString()
]], async (request, response) => {
  // Checking if the user is authenticated
  const isAuthenticated = await checkIfAuthenticated(request.user.id); 
  if (!isAuthenticated) {
    return response.json({error: "The user is not authenticated (has not verified his email)"});
  }

  // If there are any errors return them
  const errors = validationResult(request).array();
  if (errors.length !== 0) {
    return response.json({error: errors});
  }

  // Getting data from the request
  const {title, description, price, image, size, brand, colorway, retailPrice, releaseDate} = request.body;

  try {
    //  Get user from middleware (request.user)
    const {id} = request.user;

    // CHECK THAT HE HASN'T UPLOADED AN ITEM BEFORE 5 MINUTES

    // Upload item
    const newItem = await new ItemOffered({
      title, ownerID: 
      id, 
      description, 
      price, 
      image, 
      size, 
      brand, 
      colorway, 
      retailPrice, 
      releaseDate, 
      date: Date.now()
    });

    // Save item
    await newItem.save();
    
    // Return the uploaded item
    return response.json({uploadedItem: newItem});
  } catch (error) {
    return response.json({error: error.message});
  } 
});

module.exports = router;