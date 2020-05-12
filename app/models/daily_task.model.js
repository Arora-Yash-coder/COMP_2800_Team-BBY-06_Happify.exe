const mongoose = require('mongoose');
 
//creates a UserSchema for mongoDB using mongoose

// const DailyTaskSchema = mongoose.Schema({
// 	//for login purposes
//     id: {
//         type: Number,
//         unique: true,
//         required: true,
//         trim: true
//       },
//       content: {
//         type: String,
//         required: true,
//       },
    
// });


const DailyTaskSchema = mongoose.Schema({
  daily_task_id : {type:Number , unique : true},
  title:{type:String},
  text_info:{type : String,required: true},
  complement:{type:String},
  date : {type : Date},
  finished:{type: Boolean},
})

 
//make it global
var DailyTask = mongoose.model('DailyTask', DailyTaskSchema);
module.exports = DailyTask;