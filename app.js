var express = require('express');
var app = express();
var bodyParser = require('body-parser');


	

// const cookieParser = require("cookie-Parser");
// const session = require("express-session");
// app.use(cookieParser);
// app.use(session({
//   key:"user_id",
//   secret:"work hard every day",
//   resave:false,
//   saveUninitialized: false,
//   cookie: {
//     expires: 600000
//   }

// }))



app.use(bodyParser.json());
 
app.use(express.static('resources'));

//"__dirname" is the path at the current folder(because app.js is at the current folder)
//this line of code exports "__basedir" to global
global.__basedir = __dirname;

// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');
 
mongoose.Promise = global.Promise;
 
// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to MongoDB.");    
}).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
});
 
require('./app/routes/user.route.js')(app);
 
// Create a Server
var server = app.listen(80, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port)
 
})