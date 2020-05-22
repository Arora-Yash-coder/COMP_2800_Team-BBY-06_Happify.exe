const mongoose = require('mongoose');





const DailyTaskSchema = mongoose.Schema({
  id: { type: Number, unique: true},
  title: { type: String, default: "null", required: true },
  paragraph: { type: Array, required: true },
  img: { type: String },
  bgm: { type: String },
  source : { type: String },
  question : { type: String },
  choices :  { type: Array },
  answer : { type: String }
})

var d = new Date();

//THE DEFAULT TASK WILL BE INITIALIZED INTO THE USER SCHEMA
const defaultTask =
{
  id:1,
  title: "ThunderBird",
  paragraph: ["Thunderbird, a supernatural creature prominent in Northwest Coast Indigenous myths. Thunder and lightning are attributed to the thunderbird, which produces thunder by flapping its wings and  lightning by opening and closing its eyes. The thunderbird is said to hunt whales, using its wings to shoot arrows.", "Among some Plains First Nations, thunderstorms are a contest between the thunderbird and a huge rattlesnake. Individuals who had been struck by lightning and survived often became Shamans, for they had received the power of the monster bird."],
  img: "/static/img/daily_tasks/1/bird.jpg",
  bgm: "/static/sound/task_1.mp3",
  source: "https://www.thecanadianencyclopedia.ca/article/thunderbird",
  question: "How is one considered a shaman",
  choices: ["When they become enlightened", "By vote of the tribe", "if they survive a lighting strike"],
  answer: "if they survive a lighting strike"
}






const UserDailyTaskSchema = mongoose.Schema({
  user_id: { type: String },
  daily_task_1: { type: DailyTaskSchema, required: true, default :defaultTask },
  daily_task_2: { type: DailyTaskSchema, required: true, },
  daily_task_3: { type: DailyTaskSchema, required: true, },
  date: { type: Date },
  finished: { type: Boolean },
  points_earned_today : {type : Number, required:true,default:0}
})

const defaultUserTask = {
  user_id: this.ObjectId,
  daily_task_1: defaultTask,
  daily_task_2: defaultTask,
  daily_task_3: defaultTask,
  date: d,
  finished: false,
}

//daily_task_rec IS THE MODEL OF DAILY TASK RECORD 
const daily_task_rec ={
  day : 1,
  finished_id : [2,3],
  date : new Date(),
  points_earned_today :0,
  user_id : '',
  state:0
}



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
  // default: defaultUserTask
  daily_task_rec: { type: Array ,required:true,default :daily_task_rec },
  daily_task_archived : {type : [Number], default:[]},
  UI_style: {type:String, default :""}
});



//Admin Schema IS THE USER SCHEMA FOR AN ADMINISTRATOR.
const AdminSchema = mongoose.Schema({
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
 
});










//MAKE USER GLOBAL
var User = mongoose.model('User', UserSchema);
module.exports = User;






// {
//   "_id": {
//       "$oid": "5ebc8b651b19be4e90f599de"
//   },
//   "id": {
//       "$numberInt": "1"
//   },
//   "title": "ThunderBird",
//   "paragraph": ["Thunderbird, a supernatural creature prominent in Northwest Coast Indigenous myths. Thunder and lightning are attributed to the thunderbird, which produces thunder by flapping its wings and  lightning by opening and closing its eyes. The thunderbird is said to hunt whales, using its wings to shoot arrows.", "Among some Plains First Nations, thunderstorms are a contest between the thunderbird and a huge rattlesnake. Individuals who had been struck by lightning and survived often became Shamans, for they had received the power of the monster bird."],
//   "img": "/static/img/daily_tasks/1/bird.jpg",
//   "bgm": "/static/sound/task_1.mp3",
//   "source": "https://www.thecanadianencyclopedia.ca/article/thunderbird",
//   "question": "How is one considered a shaman",
//   "choices": ["When they become enlightened", "By vote of the tribe", "if they survive a lighting strike"],
//   "answer": "if they survive a lighting strike"
// }








