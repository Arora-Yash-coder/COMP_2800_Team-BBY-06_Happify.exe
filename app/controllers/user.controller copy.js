var MongoClient = require('mongodb').MongoClient;
//User is a mongoDB schema, which defines how a data object should look like
const User = require('../models/user.model.js');
const fs = require('fs');
var bodyParser = require('body-parser');
const dbConfig = require('../config/mongodb.config.js');
// save is a function that saves the stringified data into the mongo Obj
// Fetch all Users
var path = __basedir + '/views/';
var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');

var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');
var progress = fs.readFileSync(path + "components/progress_bar.ejs","utf-8")


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

    res.redirect('/login');
};

var ObjectId = require('mongodb').ObjectID;
exports.verify = (req, res) => {
    // MongoClient.connect(dbConfig.url, function (err, db) {
    //     console.log("n=================================")
    //     console.log()
    //     if (err) throw err;
    //     var dbo = db.db("test");
    //     dbo.collection("users").updateOne(
    //         { daily_task_rec: { $elemMatch:  { _id: ObjectId(req.session.user_sid),date: { $lte: new Date() } } } },
    //         { $set: { "daily_task_rec.$.user_id": req.session.user_id } },
    //         { upsert: true }
    //     )
    //     res.end();
    // })

    let usn = req.body.username;
    let successMsg = " login successful";
    let incorrectMsg = "password not correct";
    let usrnameNotFoundMsg = "username not found";
    console.log("the user tried logging in with username: \n" + usn);




    var path = __basedir + '/views/';
    var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');

    var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');

    let query = User.findOne({ "username": usn });
    query.then(function (theUser) {
        //if the user exists
        if (theUser) {
            //and the password corresponds to the username from the DB
            if (theUser.toObject().password == req.body.password) {
                console.log(theUser.toObject().username + successMsg)
                req.session.user_sid = theUser.toObject()._id;
                req.cookies.user_sid = theUser._id;
                console.log("theUser.UI_style=============== in 91")
                console.log(theUser)
                console.log(theUser.password)
                console.log(theUser.UI_style)

                req.session.UI_style = theUser.UI_style;
                console.log("theUser.UI_style=============== in 95")
                console.log(req.session.UI_style)
                req.cookies.sub = "null";
                req.cookies.UI_style = theUser.UI_style;
                res.cookie({
                    "user_sid": theUser._id,
                    "sub": "null",
                    "UI_style": theUser.UI_style
                })
                console.log("req.cookies======================")
                console.log(req.cookies)
                // console.log("req.session.user_sid" + req.session.user_sid);
                // res.send(successMsg);
                console.log("redirecting to homepage----------")
                res.redirect("/homepage")
                // res.redirect("/homepage")
                res.end()
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

//shows the daily knowledge(not in use)
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

//find and send daily task in arrays to the front end
exports.dailyTasks = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("daily_tasks").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send({ result: result });
            db.close();
        });
    });
}

//rate down the daily task(not in use)
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


//rate up the daily task(not in use)
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


//rate down the daily knowledge (not in use)
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


//rate up the daily task(not in use)
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



//get user profile
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

//change user profile, used in user_profile page
exports.setProfile = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(dbConfig.url, function (err, db) {
        console.log("req.body================")
        console.log(req.body.phoneno)

        var dbo = db.db("test");
        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phoneno: req.body.phoneno
                }
            },
            { multi: true, new: true }
        )
        // if (err) throw err;
        // var dbo = db.db("test");
        // dbo.collection("users").find({
        //     _id: ObjectId(req.session.user_sid)
        // }).toArray(function (err, result) {
        //     console.log("req.session.result")
        //     console.log(result)
        //     console.log("req.session.user_sid")
        //     console.log(req.session.user_sid)
        //     if (err) throw err;
        //     // console.log(result);

        //     res.send({ result: result });
        //     
        // });
        db.close();

    });
    res.redirect('/user_profile')
}


// var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');

var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');
exports.getCoupon = (req, res) => {
    let state = null;
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        dbo.collection("users").find({
            _id: ObjectId(req.session.user_sid)
        }).toArray(function (err, result) {
            state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
            db.close()
            
            MongoClient.connect(dbConfig.url, function (err, db) {
                if (err) throw err;
                
                var dbo = db.db("test");

                dbo.collection("coupons_available").find().limit(5).toArray(function (err, result) {
                    if (err) throw err;
                    console.log(result)

                    db.close();

                    if (state >= 7) {
                        res.end(res.render(path + "coupon.ejs", {
                            coupons: result,
                            navbar: navbar_top_ejs,
                            progress_bar :undefined,
                            back_button: undefined,
                            proceed_button: undefined,
                            footer: footer,

                        }));
                    } else {
                        res.render(path + "coupon.ejs", {
                            coupons: result,
                            back_button: "<button id='back' onclick='window.location.href='/minigames';'>Back</button>",
                            proceed_button: "<button id='proceed' onclick='window.location.href='./flow_final.html''>Proceed</button>",
                            progress_bar :progress,
                            navbar: undefined,
                            footer: footer
                        });
                    }
                    //    res.send( { result });

                });
            });
        })

    })

}
let points_needed = undefined;
let user_points;
exports.redeemCoupon = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    let id = parseInt(req.body["id"])
    MongoClient.connect(dbConfig.url, function (err, db) {

        console.log("+++++++++++++++++++++++req.body===============================")

        console.log("+++++++++++++++++++++++req.SESSION===============================")
        console.log(req.session)

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

            if (result[0]) {
                if (result[0].points >= 0) {
                    user_points = result[0].points;
                } else {
                    console.log("go ahead")
                }
            } else {
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
        });

        if (req.session.user_sid && user_points && (user_points - points_needed) >= 0) {
            console.log("redeem successful")
            console.log(-points_needed);
            console.log("id===================================");
            console.log(id);
            dbo.collection("users").updateOne(
                { _id: ObjectId(req.session.user_sid) },
                {
                    $inc: { points: -points_needed },
                    $push: { coupons_owned: id }
                },
                { new: true }

            )
            db.close();

            res.send("redeem successful");

        }
    });
}

exports.viewOwnedCoupons = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    let coupon_id_array;
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        dbo.collection("users").find({
            _id: ObjectId(req.session.user_sid)
        }).toArray(function (err, result) {
            coupon_id_array = result[0].coupons_owned;

            dbo.collection("coupons_available").find({
                id: { $in: coupon_id_array }
            }).limit(5).toArray(function (err, data) {

                console.log(data)
                res.render(path + "coupon.ejs", {

                })
            });
        });
    });



}

//show the user's points
exports.getUserPoints = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    let id = parseInt(req.body["id"])
    MongoClient.connect(dbConfig.url, function (err, db) {

        console.log("+++++++++++++++++++++++req.body===============================")

        console.log("+++++++++++++++++++++++req.SESSION===============================")
        console.log(req.session)

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
            //if the user exists
            if (result[0]) {
                //if the user's points are 0 or positive
                if (result[0].points >= 0) {
                    //show user points
                    user_points = result[0].points;
                } else {
                    //leave the code alone
                    console.log("go ahead")
                }
            } else {
                //show user points failed
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
        });

        if (req.session.user_sid && user_points && (user_points - points_needed) >= 0) {
            console.log("redeem successful")
            console.log(-points_needed);
            console.log("id===================================");
            console.log(id);
            dbo.collection("users").updateOne(
                { _id: ObjectId(req.session.user_sid) },
                {
                    $inc: { points: -points_needed },
                    $push: { coupons_owned: id }
                },
                { new: true }

            )
            db.close();

            res.send("redeem successful");

        }
    });
}

//reads the user's input and search the items on the backend
//returns the results in arrays
exports.searchCoupon = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // let id = parseInt(req.body)
    console.log("req.body in searchCoupon line 508=")
    console.log(req.body)
    MongoClient.connect(dbConfig.url, function (err, db) {

        console.log("+++++++++++++++++++++++req.body[search_box]===============================")

        // for (var i in req.body) {
        let search_input = req.body.serach_box
        console.log(search_input)
        let regex_input = ".*" + search_input + ".*"
        let points_input = parseInt(req.body.serach_box)
        console.log(regex_input)
        console.log(points_input)
        // }
        console.log("+++++++++++++++++++++++req.SESSION===============================")



        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("coupons_available").find(
            { $or: [{ title: { $regex: regex_input } }, { description: { $regex: regex_input } }, { points: { $lte: points_input } }] }
        ).limit(5).toArray(function (err, result) {
            if (err) throw err;
            console.log("gets back the result=================");
            console.log(result);

            db.close();
            // res.send(result)
            // res.redirect("/homepage")
            res.render(path + "coupon.ejs", {
                coupons: result,
                navbar: navbar_top_ejs,
                footer: footer
            })
        });
    })
}

//the admin wants to log in
exports.verifyAdmin = (req, res) => {
    let usn = req.body.username;
    let successMsg = " login successful";
    let incorrectMsg = "password not correct";
    let usrnameNotFoundMsg = "username not found";
    console.log("the user tried logging in with username: \n" + usn);








    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection("users").findOne({ "username": usn }).then(function (theUser) {
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
                    console.log("redirecting to homepage----------")
                    res.redirect("/homepage")
                    // res.redirect("/homepage")
                    res.end()
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


        })

    })
}

//the admin wants to search for a coupon
exports.admin_coupon_management = (req, res) => {
    console.log("searching")

}

//the user gains according points
exports.addPoints = (req, res, n) => {
   
    MongoClient.connect(dbConfig.url, function (err, db) {
        console.log("n=================================")
        console.log(n)




        if (err) throw err;
        var dbo = db.db("test");
        let id = parseInt(req.body["id"])
        console.log(id)
        console.log("^^^^^^^id")
        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            { $inc: { points: n } },
            { upsert: true }
        )

        dbo.collection("users").updateOne(
            {
                // daily_task_rec: { $elemMatch: { "user_id": req.session.user_sid, date: { $lte: new Date() } } },
                _id: ObjectId(req.session.user_sid),
                daily_task_rec: { $elemMatch: { "state": { $lte: 10 }, date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } },
            },
            { $inc: { "daily_task_rec.$.points_earned_today": n } },
            // { upsert: true }
        )


        //     dbo.collection("users").find({ "daily_task_rec": { $elemMatch :{ "user_id" :'5ebd0264a845395b60ce3d69'}}  
        // }).toArray(function (err, result) {
        //         console.log("array result------------------------")
        //         console.log(result)
        //         if (err) throw err;
        //         db.close();
        //     });



        //     dbo.collection("users").find({ "daily_task_rec": { $elemMatch : {points_earned_today :0} } 
        // }).toArray(function (err, result) {
        //         console.log("array daily_task_rec------------------------")
        //         console.log(result)
        //         if (err) throw err;
        //         db.close();
        //     });








        dbo.collection("users").find({
            _id: ObjectId(req.session.user_sid)
        }).toArray(function (err, result) {
            console.log("req.session.result")
            console.log(result)
            console.log("req.session.user_sid")
            console.log(req.session.user_sid)
            if (err) throw err;
            // console.log(result);

            
            db.close();
        });




    });
}

//gets the state the user is in
exports.getState = (req, res) => {
    let getState = null;
    let res_arr = []

    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        dbo.collection("users").find(
            {
                _id: ObjectId(req.session.user_sid),
                daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
            }
        ).toArray(function (err, result) {
            let daily_task_array = []

            // getState = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state
            console.log("This is how the data schema is like:")
            console.log(result)

            console.log(new Date(new Date().setDate(new Date().getDate() - 2)))

            //     if(result.length != 0){
            //     console.log("Push the dates into an array and do comparison")
            //      res_arr = result[0].daily_task_rec

            let days_of_use = result.length
            //     console.log("The variable shows the days of the user has been using it")
            //     console.log(days_of_use)

            //     for (var index in res_arr) {
            //         daily_task_array.push(res_arr[index].date);
            //     }


            //     console.log("This is how the date array looks like:")
            //     console.log(daily_task_array)

            // }

            db.close()

            if (result.length == 0) {
                MongoClient.connect(dbConfig.url, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("test");
                    console.log("in line 796 days_of_use")
                    console.log(days_of_use)
                    dbo.collection("users").updateOne(
                        { _id: ObjectId(req.session.user_sid) },
                        {
                            $push: {
                                daily_task_rec: {
                                    user_id: req.session.user_id,
                                    points_earned_today: 0,
                                    date: new Date(),
                                    finished_id: [],
                                    state: 0,
                                    day: days_of_use + 1
                                }
                            }
                        },
                        { new: true, upsert: true }


                    )
                    db.close()
                    console.log("pushed?????????????????????????????")
                })
            } else {
                MongoClient.connect(dbConfig.url, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("test");

                    dbo.collection("users").find({
                        _id: ObjectId(req.session.user_sid)
                    }).toArray(function (err, result) {

                        //find the work that needs to be done
                        console.log("result.daily_task_rec.state")
                        // console.log(result[0].daily_task_rec)
                        console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state)

                        state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
                    })
                })
            }
        })

    })
}





// //gets the state the user is in
// exports.getState = (req, res) => {
//     let getState = null;

//     MongoClient.connect(dbConfig.url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("test");

//         dbo.collection("users").find({
//             _id: ObjectId(req.session.user_sid)
//         }).toArray(function (err, result) {
//             getState = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state
//             console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++getState")

//         })
//     })

// }