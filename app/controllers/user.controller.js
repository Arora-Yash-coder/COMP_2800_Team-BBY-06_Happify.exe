//User is a mongoDB schema, which defines how a data object should look like
const User = require('../models/user.model.js');
const fs = require('fs');
// save is a function that saves the stringified data into the mongo Obj
exports.register = (req, res) => {
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
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
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
        setTimeout(() => {
            //if the user exists
            if (theUser) {
                //and the password corresponds to the username from the DB
                if (theUser.toObject().password == req.body.password) {
                    console.log(theUser.toObject().username + successMsg)
                    
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
        }, 20)

    })

}
