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

    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("in line 796 days_of_use")

        dbo.collection("users").updateOne(
            { _id: ObjectId(req.session.user_sid) },
            { $set: { "vapidKeys": vapidKeys } },
            { new: true, upsert: true }
        )
        db.close()
        console.log("vapidKeys : publicKey && vapidKeys: private")
    })

    res.send(vapidKeys)
}

exports.sub_info = (req,res,sub) => {
    MongoClient.connect(dbConfig.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("in line 796 days_of_use")

        dbo.collection("users").find(
            { _id: ObjectId(req.session.user_sid) },
        ).toArray((err,result)=>{
            db.close()
            console.log("vapidKeys : publicKey && vapidKeys: private")
            vapidKeys = result[0].vapidKeys

            cron.scheduleJob('45 * * * * *', function(){

                push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)

                push.sendNotification(JSON.parse(sub), 'test message')

                console.log('This runs at the 45th second of every minute.');
            });
            // push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)

            // push.sendNotification(JSON.parse(sub), 'test message')
        })
        
       
    })



    console.log("vapidKeys-==------------")
    console.log(vapidKeys)
    console.log("sub in 13")
    console.log(JSON.parse(sub))
    // let sub =  {"endpoint":"https://fcm.googleapis.com/fcm/send/cE4v1LAeyyU:APA91bFoHeD8962mH6iQwE75kmnkDvzRoXPIjRiR6nuI7W_qUaFeEKoKNP1EjiGfksGfr05lh-_w3OF8dKMt6EGn3nTBr4scv-1KLLHugLkH0E7oyQ2T4toWtdcCDVlovqFGQ3JS8Tq-","expirationTime":null,"keys":{"p256dh":"BGT_I9Z1eBpeGtUkq2G4Y-xCsGPf6tfmCpLbPmCipT1yPOqbXoBq3ASrVRYLp80ZquA3eRq8Q2-b5V5BvnMIR_A","auth":"l_nbweWAgM1Oy6q1sWebbQ"}}



}

