var MongoClient = require('mongodb').MongoClient;
//User is a mongoDB schema, which defines how a data object should look like
const User = require('../models/user.model.js');
const fs = require('fs');
var bodyParser = require('body-parser');
const dbConfig = require('../config/mongodb.config.js');
// save is a function that saves the stringified data into the mongo Obj
exports.register = (req, res) => {
    console.log(req.body);
    console.log('Post a User: ' + JSON.stringify(req.body));

    //now create a User Object
    //note that the "req.body" prefix 
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phoneno: req.body.phoneno,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });


    // Save a Customer in the MongoDB
    // user.save()
    //     .then(data => {
    //         res.send(data);
    //     }).catch(err => {
    //         res.status(500).send({
    //             message: err.message
    //         });
    //     });
    
    User.create(user);
    return;
};

// Fetch all Users
exports.findAll = (req, res) => {
    console.log("Fetch all Users");

    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


exports.verify = (req, res) => {
    let usn = req.body.username;
    let successMsg = " login successful";
    let incorrectMsg = "password not correct";
    let usrnameNotFoundMsg = "username not found";
    console.log("the user tried logging in with username: \n" + usn);




    var path = __basedir + '/views/';
    var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');
	var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
    var toolbar_bottom = fs.readFileSync(path + "components/toolbar_bottom.ejs", 'utf-8');
    
    let query = User.findOne({ "username": usn });
    query.then(function (theUser) {
            //if the user exists
            if (theUser) {
                //and the password corresponds to the username from the DB
                if (theUser.toObject().password == req.body.password) {
                    console.log(theUser.toObject().username + successMsg)
                    req.session.user_sid = theUser.toObject()._id;
                    req.cookies.user_sid = theUser._id;
                    req.cookies.sub = "null";
                    res.cookie({"user_sid" : theUser._id,
                    "sub" : "null"
                })
                    console.log("res.cookies======================" +res.cookies)
                    // console.log("req.session.user_sid" + req.session.user_sid);
                    // res.send(successMsg);
                    res.render(path + "homepage.ejs", {
                        navbar: navbar_top_ejs,
                        body: body_ejs,
                        toolbar: toolbar_bottom,
                    });
                    
                }
                //but the password was not right
                else {
                    console.log(incorrectMsg)
                    res.send(incorrectMsg);
                    
                }
                //the user doesn't even exist
            } else {
                console.log(usrnameNotFoundMsg);
 
                res.send(usrnameNotFoundMsg);
 
            }
            res.end();
       
    })

}


exports.push = (req, res) => {
    console.log('Post a User: ' + JSON.stringify(req.body));

    //now create a User Object
    //note that the "req.body" prefix 
    const user = new User({
        username: req.body.username,
        timetosleep: req.body.time, 
    });

    //subscrption
    const sub = req.body.endpoint

    // Save a Customer in the MongoDB
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.dailyKnowledge = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
   MongoClient.connect(dbConfig.url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  dbo.collection("user_daily_knowledge").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
      res.send({ result: result });
    db.close();
  });
});
}

exports.dailyTasks = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
	   MongoClient.connect(dbConfig.url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  dbo.collection("user_daily_task").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		  res.send({ result: result });
		db.close();
	  });
	});
    }
    
exports.getProfile = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
   MongoClient.connect(dbConfig.url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  dbo.collection("users").find({
     
      
  }).toArray(function(err, result) {
    if (err) throw err;
    // console.log(result);
      
      res.send({ result: result });
    db.close();
  });
});
}



