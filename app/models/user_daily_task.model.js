const mongoose = require('mongoose');
const DailyTask = require('../models/daily_task.model.js');


var UserDailyTask = mongoose.model('UserDailyTask',UserDailyTaskSchema);
module.exports = UserDailyTask;