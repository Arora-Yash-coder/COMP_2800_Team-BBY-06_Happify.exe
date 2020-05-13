const mongoose = require('mongoose');


const DailyTaskSchema = mongoose.Schema({
  daily_task_id : {type:Number , unique : true},
  title:{type:String, default : "null",required: true},
  text_info:{type : String,required: true},
  complement:{type:String},
  date : {type : Date},
  finished:{type: Boolean},
})


const UserDailyTaskSchema = mongoose.Schema({
  user_id: {type:String},
  daily_task_1 : { type:[DailyTaskSchema], required:true,},
  daily_task_2 : { type:[DailyTaskSchema], required:true,},
  daily_task_3 : { type:[DailyTaskSchema], required:true,},
})

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
    daily_task :{ type: [UserDailyTaskSchema] }
	//
});






//make it global
var User = mongoose.model('User', UserSchema);
module.exports = User;