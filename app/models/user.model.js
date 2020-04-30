const mongoose = require('mongoose');
 
const UserSchema = mongoose.Schema({
	//login purposes
    username: String,
    password: String,
    email: String,
   //user info (optional)
    firstname: String,
    lastname: String,
    phoneno: String,
	//
});
 
module.exports = mongoose.model('User', UserSchema);