const mongoose = require("mongoose");

const ItemOffered = mongoose.Schema({
  title : {type: String, required: true},
  ownerID: {type: String, required: true},
  description : {type: String, required: true},
  price: {type: Number, required: true},
  image: {type: String, required: true},
  size: {type: String, required: true},
  brand: {type: String, required: true},
  colorway: {type: String, required: true},
  retailPrice: {type: Number, required: true},
  releaseDate: {type: Date, required: true},
  date: {type: Date, required: true}
});

// Export the Schema as a model
module.exports = mongoose.model("items", ItemOffered);