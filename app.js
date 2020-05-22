var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/resources/static/img/favicon-32x32.png'));

//NODE.js USES THE RESOURCES FOLDER UNDER THE ROOT FOLDER FOR
//ANY FILE SOURCE BY DEFAULT
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

MongoClient.connect(dbConfig.url, function (err, db) {
  if (err) throw err;
})




require('./app/routes/multiplayer.route.js')(app);
require('./app/routes/user.route.js')(app);



//fs is the file reader sync module
var fs = require('fs')

//HTTPS is SSL based server
//const https = require('https');
//
////these are the keys:
////if you dont have those keys and you wanna run 
////the server, comment out the code in line 55 and
////the following block of code as well.
//var options = {
//  key: fs.readFileSync('./privatekey.pem'),
//  cert: fs.readFileSync('./certificate.pem')
//};
//
//
//
//
//https.createServer(options, app).listen(443, function () {
//  console.log('Https server listening on port ' + 3011);
//});

// Create a Server
var http_server = app.listen(3000, function () {

  var host = http_server.address().address
  var port = http_server.address().port

  console.log("App listening at http://%s:%s", host, port)

})

////////////////////////////////////////////////////////////////////////////////////////
//                SOCKET.IO FOR CHAT BOX AT 3000
////////////////////////////////////////////////////////////////////////////////////////
// THE KEY CODE
const io = require('socket.io')(http_server)

//the users are json objects
const users = {}

//on connection, the server reads in the 
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  //
  socket.on('send-text-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
//                     SOCKET.IO FOR CHAT BOX                                            //
///////////////////////////////////////////////////////////////////////////////////////////