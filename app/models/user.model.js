const mongoose = require('mongoose');
 




//creates a UserSchema for mongoDB using mongoose
const UserSchema = mongoose.Schema({
	//for login purposes
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
   //user info (optional)
    firstname: String,
    lastname: String,
    phoneno: String,
    coupons_owned: { type: Array, default: [1] },
    points: { type: Number, default: 1 },
    daily_task :{ type: UserDailyTaskSchema }
	//
});






//make it global
var User = mongoose.model('User', UserSchema);
module.exports = User;