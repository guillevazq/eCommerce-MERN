const Account = require("../models/Account");

module.exports = async id => {
  // Finding the account
  const account = await Account.findById(id);
  
  // Returning the admin state
  return account.admin; 
}