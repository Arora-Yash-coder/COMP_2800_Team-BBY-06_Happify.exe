// //import web-push to this controller
// var push = require('web-push')
// var session = require('express-session');

// //exports push to be a function that is accessable for the world
// exports.push = (req,res) =>{
//     let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/cWeZa3YmIa4:APA91bEJm2VDc4lQFlFOMWtsJSzEAtp6_SwEdPmxn8K81y5Uw1P9IqLyC8-IkHS17QmrrWbNL2nS7i_xigdU4rAV_Lbc2Q19O2qdxTYu4ETX-yiz55jxVCtVA8mEi5GXKwsHk9IP64fw","expirationTime":null,"keys":{"p256dh":"BCv6JuLUv4Jr-Zdt7dkmK48hqiqA7TpNikZXnx5M5buTdJx_6-pdKCZaq2w_qPVqQIAPw8s2eFTsOX_LpQfHn4w","auth":"rOanjFsUqHVdBgz9GxkyOQ"}}
//     console.log("pushing")
//     // sub = req.session.sub;
//     console.log("cookioes " + req.session.user_sid)
// /* //step 1:get VapidIDkeys
// let vapidKeys = push.generateVAPIDKeys();

// // console.log(vapidKeys); */

// console.log("pushing")
// let vapidKeys = {
//     publicKey: 'BHzTemBBukw8OY7qXGqtXPPIGSr-TyACw3rNEcmsBTx2gEJQ2YECWff5oBMb9fRss7vhn3a6ATNxucmb52zHM2U',
//     privateKey: 'fW97xyBbRKUBqr_7Tn9l8X91i-rDlsY4PUAAZBBj17U'
// }

// // sub changes 




// push.setVapidDetails('futurecurves:test@judaozhong.com',vapidKeys.publicKey,vapidKeys.privateKey)

// push.sendNotification(sub,'test message')
// }

// //exports subscribe to the outisde world
// exports.subscribe = (req,res) =>{
//     // the endpoint from the request is stored in the session 

//     // console.log(Object.keys(req.body)[0]);
//     req.session.sub = Object.keys(req.body)[0];
//     req.cookies.sub = Object.keys(req.body)[0];
//     console.log("req.session.sub >?????????????????>>>>>>>>>>>>>>>>>>>>>>>>>>>>> /n"+ req.session.sub)
//     // res.send(req.session.sub);
// }