module.exports = function (app) {

	var path = __basedir + '/views/';
	global.path = path;



	var subs;
	var vKey;
	var pusher = require('web-push')
	//It's a NodeJS package that allows us to hash passwords for security purposes.
	const bcrypt = require("bcrypt");
	//parse the body to the right format
	bodyParser = require("body-parser")

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	// parse application/json
	app.use(bodyParser.json())



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

	//import stockfish
	const stockfish = require('stockfish');
	var stockfishes = [];
	var id = 0;
	var uci = [];
	stockfishes[id] = stockfish();
	uci[id] = "position startpos moves "







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
			res.redirect('/homepage');
		} else {

			//if the session is not there or the user_sid wasn't correct,
			//then it would move to the login page
			next();
		}
	};

	var sessionChecker2 = (req, res, next) => {
		if (!req.session || !req.cookies.user_sid) {
			//if it is there, it would redirect to homepage
			res.redirect("/login");
		} else {

			//if the session is not there or the user_sid wasn't correct,
			//then it would move to the login page
			next();
		}
	};

	//======================Judao ChessGame================================================
	app.get('/checkstatus', sessionChecker, (req, res) => {
		res.redirect('/login');
		res.end();
	});

	// app.get("/game/chess", (req, res) => {
	// 	res.redirect("judaozhong.com:3001")
	// })

	app.get('/coupon', sessionChecker2, users.getCoupon);

	// var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
	var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');

	var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');


	var MongoClient = require('mongodb').MongoClient;
	const dbConfig = require('../config/mongodb.config.js');
	var ObjectId = require('mongodb').ObjectID;
	app.get('/my_coupons', sessionChecker2, (req, res) => {
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
					res.end(res.render(path + "my_coupons.ejs", {
						coupons: data,
						navbar: navbar_top_ejs,
						footer: footer
					}));
				});
			});
		});
	}

	);


	app.get("/my_record", (req, res) => {
		res.render(path + "my_record.ejs", {
			navbar: navbar_top_ejs,
			footer: footer
		})
	})

	app.get("/user_profile", sessionChecker2, (req, res) => {
		res.render(path + "user_profile.ejs", {
			navbar: navbar_top_ejs,
			footer: footer
		})
	})

	app.get("/about_us", (req, res) => {
		res.sendFile(staticPath + "about_us.html")
	})

	//goes to the homepage 
	app.get("/homepage", (req, res) => {

		res.render(path + "/homepage.ejs", {
			navbar: navbar_top_ejs,
			footer: footer
		})

	})

	//the minigame entrance
	app.get("/minigames", sessionChecker2, (req, res) => {

		let state = null;

		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {


				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

				if (state == 4) {
					res.end(res.render(path + "games_selection.ejs", {
						
						navbar: undefined,
						proceed_button : undefined,
						back_button:"<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
						footer: footer,

					}));
				}
				else if (state == 5) {
					res.end(res.render(path + "games_selection.ejs", {						
						navbar: undefined,
						proceed_button: "<button id='proceed' onclick='window.location.href='/coupon''>Proceed</button>",
						back_button :  "<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
						footer: footer,

					}));
				}

				else if (state >= 7) {
					res.end(res.render(path + "games_selection.ejs", {
						navbar: navbar_top_ejs,
						proceed_button: undefined,
						back_button : undefined,
						footer: footer,
					}));
				}


			});

		});




		// res.render(path + "games_selection.ejs", {
		// 	// navbar: navbar_top_ejs,
		// 	navbar: undefined,
		// 	footer: footer
		// })
	})

	//when the users click on this,
	app.post('/coupon/redeem', users.redeemCoupon);

	app.get("/restart", (req, res) => {
		uci[id] = "position startpos moves ";
		stockfishes[id].postMessage(uci[id]);
		res.redirect("/game/chess")
	})


	app.post("/game/chess", (req, res) => {
		// console.log("req.body")
		// console.log(req.body)
		var next_move = []
		console.log("uci-=================================================")
		console.log(req.body["uci"])
		stockfishes[id].postMessage(uci[id] + " " + req.body["uci"]);
		uci[id] = uci[id] + " " + req.body["uci"]
		console.log("-=---------=-=-=-=-=-=-uic[id]-=-=-=-=-=-=-=-=-=-=-=-=");
		console.log(uci[id]);
		stockfishes[id].postMessage("go infinite");
		setTimeout(() => {
			stockfishes[id].postMessage("stop");
			stockfishes[id].postMessage("d");
		}, 100);


		stockfishes[id].onmessage = function (message) {
			if (message.startsWith("bestmove")) {

				next_move = message.split(" ")

			}
			if (next_move.length != 0) {
				console.log("msg");
				console.log(next_move);
				//1 is the position where the bestmove uci is
				uci[id] = uci[id] + " " + next_move[1]
				res.send(next_move[1])
			}
			console.log(message)
		}
	})
	//^^^^^^^^^^^^^^^^^==Judao ChessGame==^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	//==================WEB PUSH NOTIFICATION=======================================================================================================================
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


	//sutff related to ejs rendering


	var staticPath = __basedir + '/resources/static/';

	app.use(express.static(staticPath));
	global.staticPath = staticPath;

	var favicon = require('serve-favicon');
	app.use(favicon(staticPath + '/img/favicon-32x32.png'));


	router.use(function (req, res, next) {
		console.log("/" + req.method);
		next();
	});




	app.get('/', (req, res) => {
		res.sendFile(staticPath + "landing_page.html");
	});

	app.get('/add_points', (req, res) => {
		users.addPoints(req, res, 10)



	});



	app.get('/reminder', (req, res) => {
		res.sendFile(path + "reminder.html");
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


	//============DBwork=====Tiffany=================================================
	app.post('/daily_tasks', (req, res) => {
		let added_item = [];
		let daily_tasks = req.body["id_array[]"];
		console.log(daily_tasks)

		for (var i in daily_tasks) {
			added_item.push(daily_tasks[i].id)
		}
		// const PromiseA = 
		//need aysnc version to deal with passing in values
		MongoClient.connect(dbConfig.url, function (err, db) {
			console.log("added_item")
			console.log(added_item)
			if (err) throw err;
			var dbo = db.db("test");
			dbo.collection("users").updateOne(
				{ _id: ObjectId(req.session.user_sid) },
				{
					$push: { daily_task_archived: { $each: added_item } }
				},
				{ new: true, upsert: true }
			)
		})
	})


	app.get('/state_add', (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").updateOne({
				_id: ObjectId(req.session.user_sid),
				daily_task_rec: { $elemMatch: { date: { $lte: new Date() } } }
			}, { $inc: { "daily_task_rec.$.state": 1 } },

			)
			res.send("state added 1!!!!!")

		})
	})


	app.get('/state_minus', (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").updateOne({
				_id: ObjectId(req.session.user_sid),
				daily_task_rec: { $elemMatch: { date: { $lte: new Date() } } }
			}, { $inc: { "daily_task_rec.$.state": -1 } },

			)
			res.send("state minused 1!!!!!")

		})
	})

	app.get('/daily_tasks', function (req, res) {
		let state = null;

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

				if (state < 3) {
					dbo.collection("daily_tasks").find({

					}).limit(3 - state).toArray(function (err, data) {
						console.log("the stuff to show -=------------------------------------------")
						console.log(data)
						res.end(res.render(path + "daily_tasks.ejs", {
							todo_item: data,
							navbar: undefined,
							proceed_button: undefined,
							footer: footer
						}));
					});
				}

				else if (state >= 3) {
					res.end(res.render(path + "daily_tasks.ejs", {
						todo_item: undefined,
						navbar: undefined,
						proceed_button: '<button id="proceed" onclick="window.location.href="/minigames"">Proceed</button>',
						footer: footer
					}));
				}
			});

		});







		// let user = null;
		// //indicating how many items left to be added into the array
		// let n_to_go = 0;
		// //used to store the upcoming tasks' ids
		// let go_ahead = []
		// MongoClient.connect(dbConfig.url, function (err, db) {
		// 	if (err) throw err;
		// 	var dbo = db.db("test");
		// 	dbo.collection("users").findOne({
		// 		_id: ObjectId(req.session.user_sid)
		// 	}).then(result => {
		// 		//if the user exists
		// 		if (result) {
		// 			//if the user has not yet finished the tasks
		// 			if (result.daily_task_rec[0].finished_id.length != 0) {
		// 				//the array is needed afterwards
		// 				go_ahead = result.daily_task_rec[0].finished_id;
		// 				//the number of stuff to go
		// 				n_to_go = 3 - go_ahead.length;
		// 			} else {
		// 				n_to_go = 3
		// 				go_ahead = [0]
		// 			}
		// 		}
		// 	}).then(() => { })

		// 	let added_item = []
		// 	//find those that's not in the done list
		// 	dbo.collection("daily_tasks").find({
		// 		"id": { $nin: go_ahead }
		// 	}).limit(n_to_go).toArray((err, daily_tasks) => {

		// 		console.log("go_ahead")
		// 		console.log(go_ahead)
		// 		console.log("n_to_go")
		// 		console.log(n_to_go)
		// 		console.log("daily_tasks")
		// 		console.log(daily_tasks)


		// 		for (var i in daily_tasks) {
		// 			added_item.push(daily_tasks[i].id)
		// 		}
		// 		console.log("=============added===daily_tasks===========================")
		// 		console.log(added_item)

		// 		res.render(path + "daily_tasks.ejs", {
		// 			navbar: undefined,
		// 			todolist: daily_tasks,
		// 			todo_item: daily_tasks,
		// 			footer: footer
		// 		})
		// 	})

		// 	dbo.collection("users").updateOne(
		// 		{ _id: ObjectId(req.session.user_sid) },
		// 		{
		// 			$push: { daily_task_archived: { $each: added_item } }
		// 		},
		// 		{ new: true, upsert: true }

		// 	)

		// 	for (var i in added_item) {
		// 		console.log("==========================added_item[i]")
		// 		console.log(added_item[i])

		// 	}

		// 	db.close();

		// });








	});









	// let daily_tasks = [];
	// MongoClient.connect(dbConfig.url, function (err, db) {
	// 	if (err) throw err;
	// 	var dbo = db.db("test");
	// 	dbo.collection("daily_tasks").find({}).toArray(function (err, result) {
	// 		if (err) throw err;
	// 		console.log(result);
	// 		daily_tasks = result;
	// 		db.close();
	// 		// _reader
	// 		res.render(path + "daily_tasks.ejs", {
	// 			navbar: undefined,
	// 			todolist: daily_tasks,
	// 			todo_item: daily_tasks,
	// 			footer: footer
	// 		})
	// 	});
	// });


	// });






	//tic tac toe connection, it runs on port 81
	app.get("/games/ttt", (req, res) => {
		res.sendFile(staticPath + "/ttt_game_entrance.html")
	})



	app.get("/games/snake", (req, res) => {
		res.sendFile(staticPath + "/snake.html")
	})


	app.get("/games/shooter", (req, res) => {
		res.sendFile(staticPath + "/zombie.html")
	})


	app.route('/getDailyKnowledge').get(users.dailyKnowledge);

	app.route('/getDailyTasks').get(users.dailyTasks);



	app.route('/getDailyTasks/dislikeTask').post(users.taskDislike);
	app.route('/getDailyTasks/likeTask').post(users.taskLike);

	app.route('/getDailyTasks/dislikeKnowledge').post(users.knowledgeDislike);
	app.route('/getDailyTasks/likeKnowledge').post(users.knowledgeLike);



	app.route('/user_profile/getProfile').get(users.getProfile);

	app.route('/user_profile/setProfile').post(users.setProfile);

	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	//=====================REGISTER PAGE=================================================================================
	app.route('/register')
		.get(sessionChecker, (req, res) => {
			res.sendFile(staticPath + "signup.html");
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
					res.redirect('/');
				});
		});

	app.route('/login')
		.get(sessionChecker, (req, res) => {
			res.sendFile(staticPath + 'login.html');
		})

	// route for user logout
	app.get('/logout', (req, res) => {

		res.clearCookie('user_sid');
		req.session = null;
		res.redirect('/login');

	});




	// Save a User to MongoDB
	app.post('/api/users/register', users.register);

	// Retrieve all Users
	app.get('/api/users/all', users.findAll);
	//check if the user is allowed to log in.
	app.post('/api/users/verify', users.verify);

	//the link to post and search for a coupon
	app.post('/coupon/search', users.searchCoupon)

	app.post("/getKey", (req, res) => {
		res.send('BHzTemBBukw8OY7qXGqtXPPIGSr-TyACw3rNEcmsBTx2gEJQ2YECWff5oBMb9fRss7vhn3a6ATNxucmb52zHM2U')
	})

	//imported for dealing with submitted pictures
	var formidable = require('formidable');

	app.post("/check_time", (req, res) => {
		console.log("time should be in here++++++++++++++++++++++++++++++")
		let client_timestamp = Date.parse(req.body.d)
		let server_timestamp = Date.now();

		//if the client time exceeds 5am
		//and the client has not done all the tasks
		//go and find the stuff in the db.
		//in the result array, look for those with "true" -> render differently
		//                     look for those with "false"-> render normally

		if (client_timestamp > server_timestamp + 3600 * 1000 * 12 || client_timestamp < server_timestamp - 3600 * 1000 * 12) {
			console.log("the user is trying to cheat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
		}
		else {
			console.log("the user is finishing all the tasks")
		}
	})

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

	app.get('/admin', (req, res) => {
		res.render(path + "admin_verify.ejs");
	});

	app.get('/admin_home', (req, res) => {
		res.render(path + "admin_home.ejs");
	});

	app.get('/admin_coupon', (req, res) => {
		console.log("searching")
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			dbo.collection("coupons_available").find({}).toArray(function (err, result) {
				if (err) throw err;
				console.log("================result=====================");
				console.log(result);
				let render = []
				console.log(result.length);
				for (var i = 0; i < result.length; i++) {
					render.push(result[i])
				}
				console.log("render--------------------")
				console.log(render)

				db.close();
				res.render(path + "admin_coupon.ejs", { todolist: render });
				console.log("RENDERED===================================");
			});
			// res.render("pages/index", { todolist: render });
		});
	});

	app.post('api/users/admin', (req, res) => {
		users.verifyAdmin
	});

	app.post('/coupon/add', (req, res) => {
		console.log(req.body)
	});

	app.post("/coupon/delete", (req, res) => {
		ids_to_delete = req.body["checked[]"]
		ids = []
		for (var each in ids_to_delete) {

			ids.push(parseInt(ids_to_delete[each]))
		}
		console.log(ids)
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("coupons_available").remove(
				{
					id: { $in: ids }
				}

			)
		});


	})



	app.use('*', (req, res) => {
		res.sendFile(path + "404.html");
	});




}