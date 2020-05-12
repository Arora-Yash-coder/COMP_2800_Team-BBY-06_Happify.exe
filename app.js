var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/resources/static/img/favicon-32x32.png'));



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

MongoClient.connect(dbConfig.url, function(err, db) {
  if (err) throw err;
})
 
require('./app/routes/user.route.js')(app);


var fs =require('fs')
const https = require('https');
var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

var server = https.createServer(options, app);

server.listen(443, () => {
  console.log("server starting on port : " + 3000)
});


https.createServer(options, app).listen(90, function () {
    console.log('Https server listening on port ' + 3011);
});

// Create a Server
// var server = app.listen(3000, function () {
 
//   var host = server.address().address
//   var port = server.address().port
 
//   console.log("App listening at http://%s:%s", host, port)
 
// })