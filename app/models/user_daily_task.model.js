const UserDailyTaskSchema = mongoose.Schema({
    user_id: {type:String},
    daily_task_1 : { type:DailyTask, default:null},
    daily_task_2 : { type:DailyTask, default:null},
    daily_task_3 : { type:DailyTask, default:null},
})


var UserDailyTask = mongoose.model('UserDailyTask',UserDailyTaskSchema)