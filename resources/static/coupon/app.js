var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb+srv://future_curves:13533407585@cluster0-sslsz.mongodb.net/test?retryWrites=true&w=majority';
let str = "";
const { JSDOM } = require('jsdom');
const fs = require("fs");
var ObjectId = require('mongodb').ObjectID;

app.get('/', function (req, res) {
    let doc = fs.readFileSync('./public/Coupon_page.html', "utf8");
    //console.log(JSDOM);
    let dom = new JSDOM(doc);
    //let $ = require("jquery")(dom.window);


    res.send(dom.serialize());
});
app.route('/test').get(function(req, res) {
    res.setHeader('Content-Type', 'application/json');
   MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
       
  dbo.collection("users").find({_id : ObjectId(req.session.user_sid)}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
      res.send({ result: result });
    db.close();
  });
});
});


//app.route('/test2').get(function(req, res) {
//    res.setHeader('Content-Type', 'application/json');
//   MongoClient.connect(uri, function(err, db) {
//  if (err) throw err;
//  var dbo = db.db("test");
//  dbo.collection("user_daily_knowledge").find({}).toArray(function(err, result) {
//    if (err) throw err;
//    console.log(result);
//      res.send({ result: result });
//    db.close();
//  });
//});
//});
var server = app.listen(4567, function() {});
console.log('Example app listening on port 4567');



