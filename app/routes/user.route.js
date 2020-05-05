module.exports = function (app) {

	var subs;
	var vKey;
	var pusher = require('web-push')
	//It's a NodeJS package that allows us to hash passwords for security purposes.
	const bcrypt = require("bcrypt");
	//parse the body to the right format
	bodyParser = require("body-parser")
	//needless to say
	var express = require("express");
	const { JSDOM } = require('jsdom');

	var router = express.Router();
	const fs = require('fs');
	// const ejs = require('ejs');
	const users = require('../controllers/user.controller.js');
	const push = require('../controllers/push.controller.js');
	const cookieParser = require('cookie-parser');
	app.use("/", router);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	var morgan = require('morgan');



	var session = require('express-session');

	app.use(cookieParser());
	app.use(session({
		key: 'user_sid',
		// user_sid :null,
		secret: 'hard work',
		resave: false,
		saveUninitialized: false,

		cookie: {

			expires: 600000
		}

	}));


	app.use((req, res, next) => {

		if (req.cookies.user_sid && !req.session.user_sid) {
			res.clearCookie('user_sid');
		}
		next();
	});

	//check if a session is there
	var sessionChecker = (req, res, next) => {
		if (req.session.user_sid && req.cookies.user_sid) {
			//if it is there, it would redirect to homepage
			res.redirect('/');
		} else {
			next();
		}
	};

	//if the session is not there or the user_sid wasn't correct,
	//then it would move to the login page
	app.get('/checkstatus', sessionChecker, (req, res) => {
		res.redirect('/login');
		res.end();
	});


	app.post("/push", (req, res) => {



		// let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/cWeZa3YmIa4:APA91bEJm2VDc4lQFlFOMWtsJSzEAtp6_SwEdPmxn8K81y5Uw1P9IqLyC8-IkHS17QmrrWbNL2nS7i_xigdU4rAV_Lbc2Q19O2qdxTYu4ETX-yiz55jxVCtVA8mEi5GXKwsHk9IP64fw","expirationTime":null,"keys":{"p256dh":"BCv6JuLUv4Jr-Zdt7dkmK48hqiqA7TpNikZXnx5M5buTdJx_6-pdKCZaq2w_qPVqQIAPw8s2eFTsOX_LpQfHn4w","auth":"rOanjFsUqHVdBgz9GxkyOQ"}}
		console.log("pushing")

		sub = JSON.parse(req.cookies["sub"]);
		console.log("session.sid " + req.cookies.user_sid)
		console.log("sub.............. ")
		console.log(sub)
		//step 1:get VapidIDkeys
		// let vapidKeys = push.generateVAPIDKeys();

		// console.log(vapidKeys); 

		// vapidKeys = vKey;
		let vapidKeys = {
			publicKey: 'BHzTemBBukw8OY7qXGqtXPPIGSr-TyACw3rNEcmsBTx2gEJQ2YECWff5oBMb9fRss7vhn3a6ATNxucmb52zHM2U',
			privateKey: 'fW97xyBbRKUBqr_7Tn9l8X91i-rDlsY4PUAAZBBj17U'
		}

		// vapidKeys ={
		// 	publicKey: 'BOLwoYGg2hw44iExdhZ71-HSMLFTKdDwjx_42_qWPwyvD_HAZMzV4K6rJS1LzKMYkv3DCbU8bP4MLgnxGTynNYA',
		// 	privateKey: 'X1t918Q8AZIU4d9jrYXaBsrlvD9xubvVMSPwUoXPJkw'
		//   }
		// sub changes 




		pusher.setVapidDetails('futurecurvess:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)
		setTimeout(() => {
			pusher.sendNotification(sub, 'test message')
		}, 20);

		console.log("date---------------------------------------------")
		console.log(req.body)

	})

	var path = __basedir + '/views/';
	global.path = path;

	router.use(function (req, res, next) {
		console.log("/" + req.method);
		next();
	});


	var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');
	var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
	var toolbar_bottom = fs.readFileSync(path + "components/toolbar_bottom.ejs", 'utf-8');

	app.get('/', (req, res) => {
		res.end(res.render(path + "homepage.ejs", {
			navbar: navbar_top_ejs,
			body: body_ejs,
			toolbar: toolbar_bottom,
		}));
	});

	app.get('/reminder', (req, res) => {
		res.sendFile(path + "reminder.html");
	});

	app.get('/success', (req, res) => {
		res.sendFile(path + "successful.html");
	});


	app.post('/subscribe', (req, res) => {
		// the endpoint from the request is stored in the session 
		let vapidKeys = pusher.generateVAPIDKeys();
		vKey = vapidKeys;
		console.log("Public vapidKeys=============================================");
		console.log(vapidKeys["publicKey"]);
		res.send(vapidKeys["publicKey"])
		// console.log(Object.keys(req.body)[0]);
		subs = Object.keys(req.body)[0];
		res.cookie({ "sub": Object.keys(req.body)[0] });
		req.session.sub = Object.keys(req.body)[0];
		console.log("req.cookies>--------------------------------------------------- ")
		console.log(req.cookies)
		console.log("req.session.sub >?????????????????>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + req.session.sub)
		// res.send(req.session.sub);
	});


	//============DBwork===========================Tiffany=================================================

	app.get('/daily_tasks', function (req, res) {
		res.sendFile(path + "daily_tasks.html");
	});

	app.route('/getDailyKnowledge').get(users.dailyKnowledge);

	app.route('/getDailyTasks').get(users.dailyTasks);

	app.get('/user_profile', function (req, res) {

		res.sendFile(path + "user_profile.html");
	});

	app.route('/getProfile').get(users.getProfile);

	//================================================


	app.route('/register')
		.get(sessionChecker, (req, res) => {
			res.render(path + "signup.ejs");
		})
		.post((req, res) => {
			//post to register
			users.register
				.then(user => {
					req.session.user = user.dataValues;
					console.log("req.session.user ???????? " + req.session.user)
					res.redirect('/');
				})
				.catch(error => {
					console.log(error)
					res.redirect('/register');
				});
		});

	app.route('/login')
		.get(sessionChecker, (req, res) => {
			res.sendFile(path + 'login.html');
		})
	// .post(
	// 	users.verify
	// );


	app.get('/:username', (req, res) => {
		res.sendFile(path + "successful.html");
	});

	// Save a User to MongoDB
	app.post('/api/users/register', users.register);

	// Retrieve all Users
	app.get('/api/users/all', users.findAll);

	app.post('/api/users/verify', users.verify);





	// app.get("/test", (req, res) => {
	// 	res.sendFile(path + "test.html")
	// });

	// app.use("/success", router);

	app.get("/game/ttt", (req, res) => {
		res.status(301).redirect("http://localhost:81")
	})

	app.post("/getKey", (req, res) => {
		res.send('BHzTemBBukw8OY7qXGqtXPPIGSr-TyACw3rNEcmsBTx2gEJQ2YECWff5oBMb9fRss7vhn3a6ATNxucmb52zHM2U')
	})

	var formidable = require('formidable');




	// app.use("*", (req, res) => {
	// 	res.sendFile(path + "404.html");
	// });


	app.post('/upload_avatar', function (req, res) {
		var form = new formidable.IncomingForm();
		console.log("about to parse");
		console.log("form=========");
		console.log(form);
		form.parse(req, function (error, fields, files) {
			console.log("parsing done");
			console.log(files.upload.path);
			console.log("===============req.session.user_sid===============")
			console.log(req.session.user_sid)
			if (req.session.user_sid != undefined && req.session != null) {
				let dir = "resources/" + req.session.user_sid;

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				if (fs.existsSync(dir)) {
					fs.writeFileSync(dir + "/avatar.png", fs.readFileSync(files.upload.path));
					res.redirect("/user_profile");
				}
			} else {
				res.redirect("/checkstatus")
			}
		});
	});





}