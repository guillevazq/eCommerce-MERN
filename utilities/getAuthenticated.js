const { response } = require("express");
const Account = require("../models/Account");

module.exports = async id => {
  try {
    // Getting the account
    const account = await Account.findById(id);

    // Returning the result
    return account.isAuthenticated;
  } catch (error) {
    return response.json({error: error.message});
  }
}