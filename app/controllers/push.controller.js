
// var cron = require('node-schedule');
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////MODULE IMPORT/////////////////////////////////

//push IS THE WEB-PUSH SUPPORTING MODULE
var push = require('web-push')

//MongoClient is the official driver
var MongoClient = require('mongodb').MongoClient;

//dbConfig IS THE CONFIGURATION WHICH INCLUDES THE CONNECTION URI
const dbConfig = require('../config/mongodb.config.js');

//THIS IS A FUNCTION TO PARSE A STRING INTO A MONGO OBJECTID
//THE MONGODB OBJECT ID(_id) IS UNIQUE FOR EACH OF THE DATABASE OBJECT 
var ObjectId = require('mongodb').ObjectID;

///////////////////////////////////////////////////////////////////////////////

//step 1:get VapidIDkeys:

//push.generateVAPIDKeys() IS THE FUNCTION TO GET A VAPIDKey FROM THE MODULE
//
///////////////////////////////////////////////////////////////////////////////




//VAPIDKeys IS PUT OUTSIDE SINCE WE WANT IT TO BE A GLOBAL VARIABLE
//IT SHOULD BE ABLE TO BE ACCESSED BY THE WHOLE REQUEST FROM THE SESSION
let vapidKeys



//NOW WE ARE GOING TO EXPORT THIS subscribe(req,res) FUNCTION FOR FURTHER USAGE
//THIS FUNCTION READS IN A REQUEST AND GIVES A CALLBACK OF res.
exports.subscribe = (req, res) => {
    //AS IN STEP 1(LINE 21), WE NEED A VAPIDKey TO DO THE WEBPUSH
    vapidKeys = push.generateVAPIDKeys();
    console.log("Getting vapidKeys in 'push.js' --------------------------Line 38-------in push.controller.js");
    console.log(vapidKeys);

    console.log("Getting the remind_time by the get request call. --------Line 41------- in push.controller.js");
    remind_time = req.body.time
    console.log(remind_time)

    //MongoClient DataBase connection
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;

        //in db "test"
        var dbo = db.db("test");
        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            {
                //$set IS THE FUNCTION TO SET SOME SPECIFIC FILEDS
                $set: {
                    "vapidKeys": vapidKeys,
                }
            },
            { upsert: true }
        )
        db.close()
        console.log("vapidKeys stored successfully into the DB!");
    })

    res.send(vapidKeys)
}


//sub_info
exports.sub_info = (req, res, sub) => {

    //MongoClient DataBase connection
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        try {
            dbo.collection("users").updateOne(
                { _id: ObjectId(req.session.user_sid) },
                {
                    $set: { sub: sub }
                }
            )
            console.log("updated")


        } catch (e) {
            console.log(e)
        } finally {
            db.close()
        }
        console.log("feedback message sent to back to the user: ------------- Line 92---------in push.controller.js")
        res.send("We will remind you at your specified time!")
    })
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                          Sends the remind time into the database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.set_reminder_time = (req, res) => {


    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("in line 796 days_of_use")

        //UPDATES THE USER'S SET REMIND TIME INTO THE DATABASE
        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            {
                $set: {
                    "remind_time": {
                        hour: parseInt(req.body.hour),
                        minute: parseInt(req.body.minute)
                    }
                }
            },
            //THIS MAKES SURE EVEN IF THE USER HASN'T SUBSCRIBED PREVIOUSLY,
            //IT STILL GOES INTO THET DATABASE.
            { new: true, upsert: true }
        )
        //TERMINATE CONNECTION
        db.close()
        //
        console.log("time set in line 97 -----------------------------------------------in line 18")
    })
}
///^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                          Sends the remind time into the database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////
//                                          ARCHIVED:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// MongoClient.connect(dbConfig.url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("test");
//     console.log("in line 796 days_of_use")

//     dbo.collection("users").find(
//         { _id: ObjectId(req.session.user_sid) },
//     ).toArray((err, result) => {
//         db.close()
//         console.log("vapidKeys : publicKey && vapidKeys: private")
//         vapidKeys = result[0].vapidKeys

//         cron.scheduleJob('15 ' + result[0].remind_time.minute+' '+result[0].remind_time.hour+' * * *', function () {

//             push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)

//             push.sendNotification(JSON.parse(sub), 'test message')

//             console.log('This runs at the 45th second of every minute.');
//         });
//         // push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)

//         // push.sendNotification(JSON.parse(sub), 'test message')
//     })

// console.log("vapidKeys-==------------")
// console.log(vapidKeys)
// console.log("sub in 13")
// console.log(JSON.parse(sub))
