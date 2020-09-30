const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAuthenticated: {type: Boolean, required: true},
  admin: {type: Boolean, required: true}
});

// Export the Schema as a model
module.exports = mongoose.model("account", accountSchema);