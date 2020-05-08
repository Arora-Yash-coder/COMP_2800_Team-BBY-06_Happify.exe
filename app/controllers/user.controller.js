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
                res.cookie({
                    "user_sid": theUser._id,
                    "sub": "null"
                })
                console.log("res.cookies======================" + res.cookies)
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

exports.dailyKnowledge = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("user_daily_knowledge").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send({ result: result });
            db.close();
        });
    });
}

exports.dailyTasks = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("user_daily_task").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send({ result: result });
            db.close();
        });
    });
}

exports.taskDislike = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        let id = parseInt(req.body["id"])
        console.log(id)
        console.log("^^^^^^^id")
        dbo.collection("user_daily_task").updateOne(
            { "id": id },
            { $inc: { dislike: 1 } },
            { upsert: true }
        )
    });
}

exports.taskLike = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        let id = parseInt(req.body["id"])
        console.log(id)
        console.log("^^^^^^^id")
        dbo.collection("user_daily_task").updateOne(
            { "id": id },
            { $inc: { like: 1 } },
            { upsert: true }
        )
        res.send("")
    });
}


exports.knowledgeDislike = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        let id = parseInt(req.body["id"])
        console.log(id)
        console.log("^^^^^^^id")
        dbo.collection("user_daily_knowledge").updateOne(
            { "id": id },
            { $inc: { dislike: 1 } },
            { upsert: true }
        )
    });
}

exports.knowledgeLike = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        let id = parseInt(req.body["id"])
        console.log(id)
        console.log("^^^^^^^id")

        dbo.collection("user_daily_knowledge").updateOne(
            { "id": id },
            { $inc: { like: 1 } },
            { upsert: true }
        )
        res.send("")
    });
}

var ObjectId = require('mongodb').ObjectID;
exports.getProfile = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("users").find({
            _id: ObjectId(req.session.user_sid)
        }).toArray(function (err, result) {
            console.log("req.session.result")
            console.log(result)
            console.log("req.session.user_sid")
            console.log(req.session.user_sid)
            if (err) throw err;
            // console.log(result);

            res.send({ result: result });
            db.close();
        });
    });
}

exports.getCoupon = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");



        dbo.collection("coupons_available").find().limit(5).toArray(function (err, result) {
            if (err) throw err;

            console.log(result)


            db.close();
            res.end(res.render(path + "coupon.ejs", {
                coupons: result
            }));
            //    res.send( { result });

        });
    });
}

exports.redeemCoupon = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    let points_needed = undefined;
    MongoClient.connect(dbConfig.url, function (err, db) {

        console.log("+++++++++++++++++++++++req.body===============================")

        console.log("+++++++++++++++++++++++req.SESSION===============================")
        console.log(req.session)
        let id = parseInt(req.body["id"])
        console.log(id)
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("coupons_available").find({ id: id }).limit(5).toArray(function (err, result) {
            if (err) throw err;
            console.log("The user needs so many points to redeem!!!!!!!!! ");
            console.log(result[0].points);
            points_needed = result[0].points;
            db.close();

        });

        dbo.collection("users").find({
            _id: ObjectId(req.session.user_sid)
        }).toArray(function (err, result) {
            let user_points;
            if(result[0].points){
                if(result[0].points >=0){
                    user_points = result[0].points;
                }else{
                    console.log("go ahead")
                }   
            }else{
                console.log("user doesn't has any points")
            }

            console.log("req.session.result")
            console.log(result)

            console.log("req.session.user_sid")
            console.log(req.session.user_sid)

            if (err || !req.session.user_sid) {
                //need to link to the front end
                console.log("not working")
                // res.end(res.send("you need to log in first!!!!"));
                
                //   throw err;
            }

            if(req.session.user_sid && user_points && (user_points - points_needed) >=0){
                console.log("redeem successful")
                res.send("success");
            }
            

            
            db.close();
        });




    });
}



