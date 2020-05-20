var cron = require('node-schedule');
var push = require('web-push')
var MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../config/mongodb.config.js');
/* //step 1:get VapidIDkeys
let vapidKeys = push.generateVAPIDKeys();

console.log(vapidKeys); */
let vapidKeys
var ObjectId = require('mongodb').ObjectID;
exports.subscribe = (req, res) => {
    vapidKeys = push.generateVAPIDKeys();
    console.log(vapidKeys);
    remind_time = req.body.time
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("in line 796 days_of_use")

        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            {
                $set: {
                    "vapidKeys": vapidKeys,
                }
            },
            { upsert: true }
        )
        db.close()
        console.log("vapidKeys : publicKey && vapidKeys: private")
    })

    res.send(vapidKeys)
}

exports.sub_info = (req, res, sub) => {

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
        res.send("We will remind you at your specified time!")

        // push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)

        // push.sendNotification(JSON.parse(sub), 'test message')
    })





}

























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







exports.set_reminder_time = (req, res) => {


    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("in line 796 days_of_use")

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
            { new: true, upsert: true }
        )
        db.close()
        console.log("time set in line 97")
    })
}
