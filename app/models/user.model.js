const mongoose = require('mongoose');
 
const DailyTaskSchema = mongoose.Schema({
  daily_task_id : {type:Number , default: 0},
  text_content:{type:String},
  supplementary:{type : String},
  complement:{type:String},
  date : {type : Date},
  finished:{type: Boolean},
})

const UserDailyTaskSchema = mongoose.Schema({
    user_id: {type:String},
    daily_task_1 : { type:DailyTaskSchema, default:null},
    daily_task_2 : { type:DailyTaskSchema, default:null},
    daily_task_3 : { type:DailyTaskSchema, default:null},
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
    daily_task :{ type: UserDailyTaskSchema }
	//
});



var DailyTask = mongoose.model('DailyTask',DailyTaskSchema)


var UserDailyTask = mongoose.model('UserDailyTask',UserDailyTaskSchema)

//make it global
var User = mongoose.model('User', UserSchema);
module.exports = User;