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




 
//make it global
var DailyTask = mongoose.model('DailyTask', DailyTaskSchema);
module.exports = DailyTask;