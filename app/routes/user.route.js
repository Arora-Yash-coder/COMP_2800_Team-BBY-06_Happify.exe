module.exports = function (app) {

	//FOR THE CONVENIENCE OF OF THE LATER VISITS
	var path = __basedir + '/views/';
	global.path = path;

	var staticPath = __basedir + '/resources/static/';


	//It's a NodeJS package that allows us to hash passwords for security purposes.
	const bcrypt = require("bcrypt");
	//parse the body to the right format
	bodyParser = require("body-parser")

	//// PARSE APPLICATION/X-WWW-FORM-URLENCODED///////////////
	/**/app.use(bodyParser.urlencoded({ extended: false }))/**/
	//                 PARSE APPLICATION/JSON                //
	/**/app.use(bodyParser.json())						   /**/
	///////////////////////////////////////////////////////////


	//needless to say
	var express = require("express");
	const { JSDOM } = require('jsdom');

	var router = express.Router();
	const fs = require('fs');
	// const ejs = require('ejs');


	//"users" IS THE MODULE WITH FUNCTIONS THAT ARE IN 
	const users = require('../controllers/user.controller.js');
	//"pusher" IS THE MODULE WITH FUNCTIONS RELATED TO Web-Push API
	const pusher = require('../controllers/push.controller.js');

	//{cookie-parser} IS THE LIBRARY TO DO COOKIE RELATED STUFF
	//ON NODE SIDE, EITHER TO READ THE COOKIE FROM THE BROWSER
	//OR SEND A COOKIE TO THE BROSWER
	const cookieParser = require('cookie-parser');


	app.use("/", router);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	var morgan = require('morgan');


	//{stockfish} IS A POWERFUL CHESS ENGINE THAT WOULD
	//CALCULATE THE MOVES BY ANALYIZING THE OVERALL SITUATION
	//IT WOULD PROVIDE A "best move" AND A "ponder" SOLUTIONS
	//AS A RESULT
	const stockfish = require('stockfish');








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


	//COMPARES THE COOKIE TO THE SESSION, FOR CHECKING IF THE 
	//USER HAS LOGED OUT OR NOT! 
	app.use((req, res, next) => {
		//THIS IS TO MAKE SURE IF THE USER HAS CLICKED ON 
		//THE LOGOUT BUTTON, THE USER LOGS OUT 
		//AND THE COOKIES ARE CLEARED AND NEEDS TO RE-LOGIN
		if (req.cookies.user_sid && !req.session.user_sid) {
			res.clearCookie('user_sid');
		}
		next();
	});

	//THE SESSION CHECKER (#1) IS A MIDDLEWARE THAT WOULD CHECK IF THE USER
	//HAS A SESSION ID OR NOT, IT IS NEEDED FOR THE LOGIN/LOGOUT FUNCTION
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

	//THE SESSION CHECKER (#2) IS A MIDDLEWARE THAT WOULD CHECK IF THE USER
	//HAS A SESSION ID OR NOT, THIS IS FOR PAGES OTHER THAN THE LOGIN/REGISTER
	//PAGE, IF ANYONE IS TRYING TO VISIT THOSE PAGES WITHOUT A SESSION ID
	//OR A "user_sid" in a COOKIE. THEN THE USER WILL BE DIRECTED TO THE 
	//LOG IN PAGE.
	var sessionChecker2 = (req, res, next) => {
		if (!req.session || !req.cookies.user_sid) {
			//if it is there, it would redirect to homepage
			res.redirect("/login");
		} else if (!req.session.user_sid) {
			console.log("req.session line 98")
			console.log(req.session)
			console.log("req.session.user_sid line 100")
			console.log(req.session.user_sid)
			res.redirect("/login");
		} else {
			//NEXT IS THE FUNCTION TO INVOKE AFTER THE CHECK IS COMPLETED
			next();
		}


	};


	app.get('/checkstatus', sessionChecker, (req, res) => {
		res.redirect('/login');
		res.end();
	});



	app.get('/coupon', sessionChecker2, users.getCoupon);

	// var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
	var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');


	var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');

	/////////////////////////////////////////////////////////////////////////////////////////////
	//---THE FOLLOWING FUNCTIONS ARE ALL RELATED TO MONGODB'S CONNECTION, CONFIGURATION etc.---//
	//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
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

				//  dbo.collection("coupons_available").aggregate(
				// 	{$group : { id : 'users.$coupons_owned', count : {$sum : 1}}}

				//  ).toArray((err,aggregate)=>{
				// 	console.log("aggregate in line 148")
				// 	console.log(aggregate)
				//  })



				coupon_id_array = result[0].coupons_owned;

				dbo.collection("coupons_available").find({
					id: { $in: coupon_id_array }
				}).limit(5).toArray(function (err, data) {

					console.log(data)
					res.end(res.render(path + "my_coupons.ejs", {
						coupons: data,
						navbar: navbar_top_ejs,
						footer: footer,
						css: result[0].UI_style
					}));
				});
			});
		});
	}

	);
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^///
	//---THE FOLLOWING FUNCTIONS ARE ALL RELATED TO MONGODB'S CONNECTION, CONFIGURATION etc.---//
	/////////////////////////////////////////////////////////////////////////////////////////////





	//THE USER WANTS TO CHANGE THE UI STYLE AND THE CHOICE IS POSTED ON THIS
	//AND WILL ALTER THE DATA BASE UPON REQUEST.
	app.post("/user_profile", (req, res) => {
		console.log("req.body data schema ==================================")
		console.log(req.body.ui_choice)
		let UI_Style = req.body.ui_choice;
		if (UI_Style == 0) {

			//if the User has chosen style 0, then we start a connection to the db
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("users").update({
					_id: ObjectId(req.session.user_sid)
				},
					{
						//we set the UI_style property to be an empty String
						$set: { UI_style: "" }
					}

				)
				req.session.UI_style = ""
				// res.session.UI_style = ""
				console.log("req.session.UI_style in 212")
				console.log(req.session.UI_style)
				db.close()
			})
		} else {
			//if the User has not chosen style 0, then we start a connection to the db
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("users").update({
					_id: ObjectId(req.session.user_sid)
				},
					{
						//we set the UI_style property to be an empty String
						$set: { UI_style: UI_Style }
					}

				)
				req.session.UI_style = UI_Style
				// res.session.UI_style = UI_Style
				console.log("req.session.UI_style in 212")
				console.log(req.session.UI_style)
				db.close()
			})
			console.log("req.session.UI_style in 220")
			console.log(req.session.UI_style)

		}


		res.send("changed")

	})

	//RENDERS THE USER PROFILE PAGE UPON REQUEST
	app.get("/user_profile", sessionChecker2, (req, res) => {
		//connect to the database
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			console.log("====")
			//find the user by session ID
			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, theUser) {

				console.log("theUser[0]===============================")
				console.log(theUser[0].UI_style)
				//set a property in the session object

				res.render(path + "user_profile.ejs", {
					navbar: navbar_top_ejs,
					footer: footer,
					css: theUser[0].UI_style + ".css"
				})

			})
			db.close()
		})




	})

	//THE ABOUT US PAGE UPON REQUEST 
	app.get("/about_us", (req, res) => {
		res.sendFile(staticPath + "about_us.html")
	})

	//THIS API SENDS THE USER TO THE DATABASE
	app.get("/homepage", sessionChecker2, (req, res) => {

		console.log("req.session.UI_style in 267")
		console.log(req.session.UI_style)
		let state = null;

		console.log(state)


		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {
				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state
				console.log("state==================================================")
				console.log(state)
				if (state <= 3) {
					res.redirect("/daily_tasks")
				}
				else if (state >= 4 && state <= 5) {
					users.addPoints(req, res, 10)
					res.redirect("/minigames")
				}
				else if (state > 5 && state <= 6) {
					res.redirect("/coupon")
				}
				else {
					console.log("req.session.UI_style-----------")
					console.log(req.session.UI_style)
					res.render(path + "/homepage.ejs", {
						navbar: navbar_top_ejs,
						footer: footer,
						css: req.session.UI_style
					})
				}
			})
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

				//THE "state" PROPERTY IS STORED IN THE FOLLOWING DATA STRUCTURE IN THE DB:
				//result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
				//WHILE THE VARIABLE "state" gets access to the data.
				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

				//IF THE USER IS AT A STATE OF 4, THEN THE USER SHOULD BE SENT TO THE GAME SECLECTION MENU
				if (state == 4) {
					res.end(res.render(path + "games_selection.ejs", {

						navbar: navbar_top_ejs,
						proceed_button: undefined,
						back_button: undefined,
						//						back_button: "<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
						progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
						footer: footer,
						css: result[0].UI_style

					}));
				}
				else if (state < 4) {
					res.redirect('/homepage');
				}
				else if (state == 5) {
					res.end(res.render(path + "games_selection.ejs", {
						navbar: navbar_top_ejs,
						proceed_button: "<button id='proceed'>Proceed</button>",
						back_button: undefined,
						//						back_button: "<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
						progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
						footer: footer,
						css: result[0].UI_style

					}));
				}

				else if (state == 6) {
					res.end(res.render(path + "games_selection.ejs", {
						navbar: navbar_top_ejs,
						proceed_button: undefined,
						back_button: undefined,
						progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
						footer: footer,
						css: result[0].UI_style
					}));
				}
				else {
					res.end(res.render(path + "games_selection.ejs", {
						navbar: navbar_top_ejs,
						proceed_button: undefined,
						back_button: undefined,
						progress_bar: undefined,
						footer: footer,
						css: result[0].UI_style
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


	//THIS IS A CHECKPOINT FOR THE USER TO SEE IF HE/SHE HAS DONE WORKING ON THE STUFF
	app.get("/flow_final", sessionChecker2, (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {
				res.render("flow_final.ejs", {
					css: result[0].UI_style,
					navbar: navbar_top_ejs
				})
			})
		})
	})







	//AN API TO REDEEM COUPON
	//INVOKED BY A 'POST' REQUEST OF THE ID OF THE COUPON TO THE DATABASE
	app.post('/coupon/redeem', sessionChecker2, users.redeemCoupon);



	/////////////////////////////////////////////////////////////////////////////////////////////
	//-----------------------------------Judao ChessGame-------------------------------------- //
	//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//


	//STOCK FISH BE PUT INTO AN ARRAY 
	//SO THE 
	var stockfishes = [];
	var id = 0;
	var uci = [];
	stockfishes[id] = new stockfish();
	uci[id] = "position startpos moves "



	//INVOKED UPON CLICKING ON THE "CHESS GAME"
	//ENTER THE CHESSBOARD
	app.get("/minigames/chess", (req, res) => {
		res.sendFile(staticPath + "/minigames/chess/chessboard.html")
	})


	//
	app.get("/minigames/chess/restart", (req, res) => {
		uci[id] = "position startpos moves ";
		stockfishes[id].postMessage(uci[id]);
		res.redirect("/minigames/chess")
	})


	app.post("/minigames/chess", (req, res) => {
		console.log("req.body")
		console.log(req.body)
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
		console.log(req.body)
		pusher.sub_info(req, res, req.body.push)


	})


	//sutff related to ejs rendering




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


	//go to the reminder page
	app.get('/reminder', sessionChecker2, (req, res) => {
		// res.sendFile(path + "remtest.html");
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {
				res.render(path + "reminder.ejs",
					{
						css: result[0].UI_style,
						navbar: navbar_top_ejs,
					});
			})
		})
	});

	app.get("/counselling",sessionChecker2, (req, res)=>{
		res.render(path + "counselling.ejs",{navbar:navbar_top_ejs})
	})

	//subscribe web-push notification stuff
	app.get('/subscribe', (req, res) => {
		pusher.subscribe(req, res)

	});

	//subscribe web-push notification stuff
	app.post('/subscribe', (req, res) => {
		// pusher.subscribe(req,res)
		pusher.set_reminder_time(req, res)
	});

	//============DBwork=====Tiffany=================================================
	app.post('/daily_tasks', (req, res) => {

		// let added_item = [];
		let daily_tasks = req.body["id_array[]"];
		console.log("531 req.body=====================================")
		console.log(req.body)
		let question_id = parseInt(req.body.id)
		let answer = req.body.answer;
		MongoClient.connect(dbConfig.url, function (err, db) {

			if (err) throw err;
			var dbo = db.db("test");

			//PLUGS THE QUESTION OUT FROM THE DB
			dbo.collection("daily_tasks").find({
				id: question_id,
			}).toArray((err, result) => {
				db.close()
				console.log("result[0]")
				console.log(result[0])
				//if the user's answer is correct
				if (answer == result[0].answer || result[0].answer == "null") {
					MongoClient.connect(dbConfig.url, function (err, db) {

						console.log("Correct Answer")
						if (err) throw err;
						var dbo = db.db("test");
						//add it to the finished arry
						// dbo.collection("users").updateOne(
						// 	{ 
						// 	  finished_id: { $elemMatch:  { user_id: req.session.user_sid, date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } } 	
						// 	},
						// 	{	
						// 		$addToSet: { finished_id: question_id   },

						// 	},
						// 	{  upsert: true }
						// )

						//add it to the daily archived
						dbo.collection("users").updateOne(
							{
								_id: ObjectId(req.session.user_sid)
							},
							{
								$addToSet: { daily_task_archived: question_id },
							},
							{ upsert: true }
						)

						//move on to the next state (set in DB, added 1)
						dbo.collection("users").updateOne({
							_id: ObjectId(req.session.user_sid),
							daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
						}, {
							$inc: { "daily_task_rec.$.state": 1 }
						})
						res.send("Correct, How Smart You ARE!!!")
						users.addPoints(req, res, 10)
						db.close()
					})
				}
				// else if(result[0].answer == "null"){
				// 	dbo.collection("users").updateOne(
				// 		{
				// 			_id: ObjectId(req.session.user_sid)
				// 		},
				// 		{
				// 			$addToSet: { daily_task_archived: question_id },
				// 		},
				// 		{ upsert: true }
				// 	)


				// 	dbo.collection("users").updateOne({
				// 		_id: ObjectId(req.session.user_sid),
				// 		daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
				// 	}, {
				// 		$inc: { "daily_task_rec.$.state": 1 }
				// 	})
				// 	res.send("Thanks for your feed back!");
				// 	users.addPoints(req, res, 5)
				// }
				else {
					res.send("Not quite")
				}
			})
		})





	})

	//BY VISITING THIS LINK, THE USER'S STATE WILL BE INCREASE 1
	//EVENT TRIGGERED BY ANSWERING THE ANSWERS CORRECTLY
	app.post('/state_add', sessionChecker2, (req, res) => {

		let state = null;

		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {
				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
				db.close()
				console.log("req.body.state_request in 611")
				console.log(req.body.state_request)
				if (
					state == 3 && req.body.state_request == "proceed button clicked in STEP 3" ||
					state == 4 && req.body.state_request == "I am ready to play a game" ||
					state == 5 && req.body.state_request == "proceed button clicked" ||
					state == 6 && req.body.state_request == "proceed button clicked in STEP 6") {
					MongoClient.connect(dbConfig.url, function (err, db) {
						console.log()
						if (err) throw err;
						var dbo = db.db("test");


						console.log("I am ready to play a game in 620")
						dbo.collection("users").updateOne({
							_id: ObjectId(req.session.user_sid),
							daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
						}, { $inc: { "daily_task_rec.$.state": 1 } },

						)
						console.log("state added 1!!!!!")
						res.send("state added 1!!!!!")

					})
				}
			})
		})




	})




	// app.get('/daily_tasks', function (req, res) {

	// 	function get_stuff_to_send(){

	// 	}


	// 	let state = null;

	// 	MongoClient.connect(dbConfig.url, function (err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db("test");

	// 		dbo.collection("users").find({
	// 			_id: ObjectId(req.session.user_sid)
	// 		}).toArray(function (err, result) {

	// 			//find the work that needs to be done
	// 			console.log("result.daily_task_rec.state")
	// 			// console.log(result[0].daily_task_rec)
	// 			console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state)

	// 			state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

	// 			//if the state property is less than 3, which indicates that user is 
	// 			//still in the "daily task" user flow.
	// 			if (state < 3) {
	// 				//then we will go to the db and find the number of items
	// 				dbo.collection("daily_tasks").find({
	// 				// 3 - state means the number of items to find	
	// 				}).limit(3 - state).toArray(function (err, data) {



	// 					console.log("the stuff to show -=------------------------------------------")
	// 					console.log(data)

	// 					db.close()



	// 					// MongoClient.connect(dbConfig.url, function (err, db) {
	// 					// 	console.log("added_item")
	// 					// 	console.log(added_item)
	// 					// 	if (err) throw err;
	// 					// 	var dbo = db.db("test");
	// 					// 	dbo.collection("users").updateOne(
	// 					// 		{ _id: ObjectId(req.session.user_sid) },
	// 					// 		{
	// 					// 			$push: { daily_task_archived: { $each: added_item } }
	// 					// 		},
	// 					// 		{ new: true, upsert: true }
	// 					// 	)
	// 					// })

	// 					res.end(res.render(path + "daily_tasks.ejs", {
	// 						todo_item: data,
	// 						navbar: undefined,
	// 						proceed_button: undefined,
	// 						footer: footer
	// 					}));
	// 				});
	// 			}

	// 			else if (state >= 3) {
	// 				res.end(res.render(path + "daily_tasks.ejs", {
	// 					todo_item: undefined,
	// 					navbar: undefined,
	// 					proceed_button: '<button id="proceed" onclick="window.location.href="/minigames"">Proceed</button>',
	// 					footer: footer
	// 				}));
	// 			}
	// 		});

	// 	});







	// 	// let user = null;
	// 	// //indicating how many items left to be added into the array
	// 	// let n_to_go = 0;
	// 	// //used to store the upcoming tasks' ids
	// 	// let go_ahead = []
	// 	// MongoClient.connect(dbConfig.url, function (err, db) {
	// 	// 	if (err) throw err;
	// 	// 	var dbo = db.db("test");
	// 	// 	dbo.collection("users").findOne({
	// 	// 		_id: ObjectId(req.session.user_sid)
	// 	// 	}).then(result => {
	// 	// 		//if the user exists
	// 	// 		if (result) {
	// 	// 			//if the user has not yet finished the tasks
	// 	// 			if (result.daily_task_rec[0].finished_id.length != 0) {
	// 	// 				//the array is needed afterwards
	// 	// 				go_ahead = result.daily_task_rec[0].finished_id;
	// 	// 				//the number of stuff to go
	// 	// 				n_to_go = 3 - go_ahead.length;
	// 	// 			} else {
	// 	// 				n_to_go = 3
	// 	// 				go_ahead = [0]
	// 	// 			}
	// 	// 		}
	// 	// 	}).then(() => { })

	// 	// 	let added_item = []
	// 	// 	//find those that's not in the done list
	// 	// 	dbo.collection("daily_tasks").find({
	// 	// 		"id": { $nin: go_ahead }
	// 	// 	}).limit(n_to_go).toArray((err, daily_tasks) => {

	// 	// 		console.log("go_ahead")
	// 	// 		console.log(go_ahead)
	// 	// 		console.log("n_to_go")
	// 	// 		console.log(n_to_go)
	// 	// 		console.log("daily_tasks")
	// 	// 		console.log(daily_tasks)


	// 	// 		for (var i in daily_tasks) {
	// 	// 			added_item.push(daily_tasks[i].id)
	// 	// 		}
	// 	// 		console.log("=============added===daily_tasks===========================")
	// 	// 		console.log(added_item)

	// 	// 		res.render(path + "daily_tasks.ejs", {
	// 	// 			navbar: undefined,
	// 	// 			todolist: daily_tasks,
	// 	// 			todo_item: daily_tasks,
	// 	// 			footer: footer
	// 	// 		})
	// 	// 	})

	// 	// 	dbo.collection("users").updateOne(
	// 	// 		{ _id: ObjectId(req.session.user_sid) },
	// 	// 		{
	// 	// 			$push: { daily_task_archived: { $each: added_item } }
	// 	// 		},
	// 	// 		{ new: true, upsert: true }

	// 	// 	)

	// 	// 	for (var i in added_item) {
	// 	// 		console.log("==========================added_item[i]")
	// 	// 		console.log(added_item[i])

	// 	// 	}

	// 	// 	db.close();

	// 	// });








	// });



	module.exports = function (app) {

		//FOR THE CONVENIENCE OF OF THE LATER VISITS
		var path = __basedir + '/views/';
		global.path = path;

		var staticPath = __basedir + '/resources/static/';


		//It's a NodeJS package that allows us to hash passwords for security purposes.
		const bcrypt = require("bcrypt");
		//parse the body to the right format
		bodyParser = require("body-parser")

	//// PARSE APPLICATION/X-WWW-FORM-URLENCODED///////////////
	/**/app.use(bodyParser.urlencoded({ extended: false }))/**/
	//                 PARSE APPLICATION/JSON                //
	/**/app.use(bodyParser.json())						   /**/
		///////////////////////////////////////////////////////////


		//needless to say
		var express = require("express");
		const { JSDOM } = require('jsdom');

		var router = express.Router();
		const fs = require('fs');
		// const ejs = require('ejs');


		//"users" IS THE MODULE WITH FUNCTIONS THAT ARE IN 
		const users = require('../controllers/user.controller.js');
		//"pusher" IS THE MODULE WITH FUNCTIONS RELATED TO Web-Push API
		const pusher = require('../controllers/push.controller.js');

		//{cookie-parser} IS THE LIBRARY TO DO COOKIE RELATED STUFF
		//ON NODE SIDE, EITHER TO READ THE COOKIE FROM THE BROWSER
		//OR SEND A COOKIE TO THE BROSWER
		const cookieParser = require('cookie-parser');


		app.use("/", router);

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		var morgan = require('morgan');


		//{stockfish} IS A POWERFUL CHESS ENGINE THAT WOULD
		//CALCULATE THE MOVES BY ANALYIZING THE OVERALL SITUATION
		//IT WOULD PROVIDE A "best move" AND A "ponder" SOLUTIONS
		//AS A RESULT
		const stockfish = require('stockfish');








		var session = require('express-session');

		app.use(cookieParser());
		app.use(session({
			key: 'user_sid',
			// user_sid :null,
			secret: 'hard work',
			resave: false,
			saveUninitialized: false,

			cookie: {

				expires: 60000000
			}

		}));


		//COMPARES THE COOKIE TO THE SESSION, FOR CHECKING IF THE 
		//USER HAS LOGED OUT OR NOT! 
		app.use((req, res, next) => {
			//THIS IS TO MAKE SURE IF THE USER HAS CLICKED ON 
			//THE LOGOUT BUTTON, THE USER LOGS OUT 
			//AND THE COOKIES ARE CLEARED AND NEEDS TO RE-LOGIN
			if (req.cookies.user_sid && !req.session.user_sid) {
				res.clearCookie('user_sid');
			}
			next();
		});

		//THE SESSION CHECKER (#1) IS A MIDDLEWARE THAT WOULD CHECK IF THE USER
		//HAS A SESSION ID OR NOT, IT IS NEEDED FOR THE LOGIN/LOGOUT FUNCTION
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

		//THE SESSION CHECKER (#2) IS A MIDDLEWARE THAT WOULD CHECK IF THE USER
		//HAS A SESSION ID OR NOT, THIS IS FOR PAGES OTHER THAN THE LOGIN/REGISTER
		//PAGE, IF ANYONE IS TRYING TO VISIT THOSE PAGES WITHOUT A SESSION ID
		//OR A "user_sid" in a COOKIE. THEN THE USER WILL BE DIRECTED TO THE 
		//LOG IN PAGE.
		var sessionChecker2 = (req, res, next) => {
			if (!req.session || !req.cookies.user_sid) {
				//if it is there, it would redirect to homepage
				res.redirect("/login");
			} else if (!req.session.user_sid) {
				console.log("req.session line 98")
				console.log(req.session)
				console.log("req.session.user_sid line 100")
				console.log(req.session.user_sid)
				res.redirect("/login");
			} else {
				//NEXT IS THE FUNCTION TO INVOKE AFTER THE CHECK IS COMPLETED
				next();
			}


		};


		app.get('/checkstatus', sessionChecker, (req, res) => {
			res.redirect('/login');
			res.end();
		});



		app.get('/coupon', sessionChecker2, users.getCoupon);

		// var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
		var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');


		var footer = fs.readFileSync(path + "components/footer.ejs", 'utf-8');

		/////////////////////////////////////////////////////////////////////////////////////////////
		//---THE FOLLOWING FUNCTIONS ARE ALL RELATED TO MONGODB'S CONNECTION, CONFIGURATION etc.---//
		//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//
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

					//  dbo.collection("coupons_available").aggregate(
					// 	{$group : { id : 'users.$coupons_owned', count : {$sum : 1}}}

					//  ).toArray((err,aggregate)=>{
					// 	console.log("aggregate in line 148")
					// 	console.log(aggregate)
					//  })



					coupon_id_array = result[0].coupons_owned;

					dbo.collection("coupons_available").find({
						id: { $in: coupon_id_array }
					}).limit(5).toArray(function (err, data) {

						console.log(data)
						res.end(res.render(path + "my_coupons.ejs", {
							coupons: data,
							navbar: navbar_top_ejs,
							footer: footer,
							css: result[0].UI_style
						}));
					});
				});
			});
		}

		);
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^///
		//---THE FOLLOWING FUNCTIONS ARE ALL RELATED TO MONGODB'S CONNECTION, CONFIGURATION etc.---//
		/////////////////////////////////////////////////////////////////////////////////////////////





		//THE USER WANTS TO CHANGE THE UI STYLE AND THE CHOICE IS POSTED ON THIS
		//AND WILL ALTER THE DATA BASE UPON REQUEST.
		app.post("/user_profile", (req, res) => {
			console.log("req.body data schema ==================================")
			console.log(req.body.ui_choice)
			let UI_Style = req.body.ui_choice;
			if (UI_Style == 0) {

				//if the User has chosen style 0, then we start a connection to the db
				MongoClient.connect(dbConfig.url, function (err, db) {
					if (err) throw err;
					var dbo = db.db("test");
					dbo.collection("users").update({
						_id: ObjectId(req.session.user_sid)
					},
						{
							//we set the UI_style property to be an empty String
							$set: { UI_style: "" }
						}

					)
					req.session.UI_style = ""
					// res.session.UI_style = ""
					console.log("req.session.UI_style in 212")
					console.log(req.session.UI_style)
					db.close()
				})
			} else {
				//if the User has not chosen style 0, then we start a connection to the db
				MongoClient.connect(dbConfig.url, function (err, db) {
					if (err) throw err;
					var dbo = db.db("test");
					dbo.collection("users").update({
						_id: ObjectId(req.session.user_sid)
					},
						{
							//we set the UI_style property to be an empty String
							$set: { UI_style: UI_Style }
						}

					)
					req.session.UI_style = UI_Style
					// res.session.UI_style = UI_Style
					console.log("req.session.UI_style in 212")
					console.log(req.session.UI_style)
					db.close()
				})
				console.log("req.session.UI_style in 220")
				console.log(req.session.UI_style)

			}


			res.send("changed")

		})

		//RENDERS THE USER PROFILE PAGE UPON REQUEST
		app.get("/user_profile", sessionChecker2, (req, res) => {
			//connect to the database
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				console.log("====")
				//find the user by session ID
				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, theUser) {

					console.log("theUser[0]===============================")
					console.log(theUser[0].UI_style)
					//set a property in the session object

					res.render(path + "user_profile.ejs", {
						navbar: navbar_top_ejs,
						footer: footer,
						css: theUser[0].UI_style + ".css"
					})

				})
				db.close()
			})




		})

		//THE ABOUT US PAGE UPON REQUEST 
		app.get("/about_us", (req, res) => {
			res.sendFile(staticPath + "about_us.html")
		})

		//THIS API SENDS THE USER TO THE DATABASE
		app.get("/homepage", sessionChecker2, (req, res) => {

			console.log("req.session.UI_style in 267")
			console.log(req.session.UI_style)
			let state = null;

			console.log(state)


			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, result) {
					state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state
					console.log("state==================================================")
					console.log(state)
					if (state <= 3) {
						res.redirect("/daily_tasks")
					}
					else if (state >= 4 && state <= 5) {
						users.addPoints(req, res, 10)
						res.redirect("/minigames")
					}
					else if (state > 5 && state <= 6) {
						res.redirect("/coupon")
					}
					else {
						console.log("req.session.UI_style-----------")
						console.log(req.session.UI_style)
						res.render(path + "/homepage.ejs", {
							navbar: navbar_top_ejs,
							footer: footer,
							css: req.session.UI_style
						})
					}
				})
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

					//THE "state" PROPERTY IS STORED IN THE FOLLOWING DATA STRUCTURE IN THE DB:
					//result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
					//WHILE THE VARIABLE "state" gets access to the data.
					state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

					//IF THE USER IS AT A STATE OF 4, THEN THE USER SHOULD BE SENT TO THE GAME SECLECTION MENU
					if (state == 4) {
						res.end(res.render(path + "games_selection.ejs", {

							navbar: navbar_top_ejs,
							proceed_button: undefined,
							back_button: undefined,
							//						back_button: "<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
							progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
							footer: footer,
							css: result[0].UI_style

						}));
					}
					else if (state < 4) {
						res.redirect('/homepage');
					}
					else if (state == 5) {
						res.end(res.render(path + "games_selection.ejs", {
							navbar: navbar_top_ejs,
							proceed_button: "<button id='proceed'>Proceed</button>",
							back_button: undefined,
							//						back_button: "<button id='back' onclick='window.location.href='/daily_tasks';'>Back</button>",
							progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
							footer: footer,
							css: result[0].UI_style

						}));
					}

					else if (state == 6) {
						res.end(res.render(path + "games_selection.ejs", {
							navbar: navbar_top_ejs,
							proceed_button: undefined,
							back_button: undefined,
							progress_bar: "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>",
							footer: footer,
							css: result[0].UI_style
						}));
					}
					else {
						res.end(res.render(path + "games_selection.ejs", {
							navbar: navbar_top_ejs,
							proceed_button: undefined,
							back_button: undefined,
							progress_bar: undefined,
							footer: footer,
							css: result[0].UI_style
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


		//THIS IS A CHECKPOINT FOR THE USER TO SEE IF HE/SHE HAS DONE WORKING ON THE STUFF
		app.get("/flow_final", sessionChecker2, (req, res) => {
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, result) {
					res.render("flow_final.ejs", { css: result[0].UI_style })
				})
			})
		})







		//AN API TO REDEEM COUPON
		//INVOKED BY A 'POST' REQUEST OF THE ID OF THE COUPON TO THE DATABASE
		app.post('/coupon/redeem', sessionChecker2, users.redeemCoupon);



		/////////////////////////////////////////////////////////////////////////////////////////////
		//-----------------------------------Judao ChessGame-------------------------------------- //
		//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//


		//STOCK FISH BE PUT INTO AN ARRAY 
		//SO THE 
		var stockfishes = [];
		var id = 0;
		var uci = [];
		stockfishes[id] = new stockfish();
		uci[id] = "position startpos moves "



		//INVOKED UPON CLICKING ON THE "CHESS GAME"
		//ENTER THE CHESSBOARD
		app.get("/minigames/chess", (req, res) => {
			res.sendFile(staticPath + "/minigames/chess/chessboard.html")
		})


		//
		app.get("/minigames/chess/restart", (req, res) => {
			uci[id] = "position startpos moves ";
			stockfishes[id].postMessage(uci[id]);
			res.redirect("/minigames/chess")
		})


		app.post("/minigames/chess", (req, res) => {
			console.log("req.body")
			console.log(req.body)
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
			console.log(req.body)
			pusher.sub_info(req, res, req.body.push)


		})


		//sutff related to ejs rendering




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


		//go to the reminder page
		app.get('/reminder', sessionChecker2, (req, res) => {
			// res.sendFile(path + "remtest.html");
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, result) {
					res.render(path + "reminder.ejs",
						{
							css: result[0].UI_style,
							navbar: navbar_top_ejs,
						});
				})
			})

		});


		//subscribe web-push notification stuff
		app.get('/subscribe', (req, res) => {
			pusher.subscribe(req, res)

		});

		//subscribe web-push notification stuff
		app.post('/subscribe', (req, res) => {
			// pusher.subscribe(req,res)
			pusher.set_reminder_time(req, res)
		});

		//============DBwork=====Tiffany=================================================







		app.post('/daily_tasks', (req, res) => {

			// let added_item = [];
			let daily_tasks = req.body["id_array[]"];
			console.log("531 req.body=====================================")
			console.log(req.body)
			let question_id = parseInt(req.body.id)
			let answer = req.body.answer;
			MongoClient.connect(dbConfig.url, function (err, db) {

				if (err) throw err;
				var dbo = db.db("test");

				//PLUGS THE QUESTION OUT FROM THE DB
				dbo.collection("daily_tasks").find({
					id: question_id,
				}).toArray((err, result) => {
					db.close()
					console.log("result[0]")
					console.log(result[0])
					//if the user's answer is correct
					if (answer == result[0].answer || result[0].answer == "null") {
						MongoClient.connect(dbConfig.url, function (err, db) {

							console.log("Correct Answer")
							if (err) throw err;
							var dbo = db.db("test");
							//add it to the finished arry
							// dbo.collection("users").updateOne(
							// 	{ 
							// 	  finished_id: { $elemMatch:  { user_id: req.session.user_sid, date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } } 	
							// 	},
							// 	{	
							// 		$addToSet: { finished_id: question_id   },

							// 	},
							// 	{  upsert: true }
							// )

							//add it to the daily archived
							dbo.collection("users").updateOne(
								{
									_id: ObjectId(req.session.user_sid)
								},
								{
									$addToSet: { daily_task_archived: question_id },
								},
								{ upsert: true }
							)

							//move on to the next state (set in DB, added 1)
							dbo.collection("users").updateOne({
								_id: ObjectId(req.session.user_sid),
								daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
							}, {
								$inc: { "daily_task_rec.$.state": 1 }
							})
							res.send("Correct, How Smart You ARE!!!")
							users.addPoints(req, res, 10)
							db.close()
						})
					}
					// else if(result[0].answer == "null"){
					// 	dbo.collection("users").updateOne(
					// 		{
					// 			_id: ObjectId(req.session.user_sid)
					// 		},
					// 		{
					// 			$addToSet: { daily_task_archived: question_id },
					// 		},
					// 		{ upsert: true }
					// 	)


					// 	dbo.collection("users").updateOne({
					// 		_id: ObjectId(req.session.user_sid),
					// 		daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
					// 	}, {
					// 		$inc: { "daily_task_rec.$.state": 1 }
					// 	})
					// 	res.send("Thanks for your feed back!");
					// 	users.addPoints(req, res, 5)
					// }
					else {
						res.send("Not quite")
					}
				})
			})





		})

		//BY VISITING THIS LINK, THE USER'S STATE WILL BE INCREASE 1
		//EVENT TRIGGERED BY ANSWERING THE ANSWERS CORRECTLY
		app.post('/state_add', sessionChecker2, (req, res) => {

			let state = null;

			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, result) {
					state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;
					db.close()
					console.log("req.body.state_request in 611")
					console.log(req.body.state_request)
					if (
						state == 3 && req.body.state_request == "proceed button clicked in STEP 3" ||
						state == 4 && req.body.state_request == "I am ready to play a game" ||
						state == 5 && req.body.state_request == "proceed button clicked" ||
						state == 6 && req.body.state_request == "proceed button clicked in STEP 6") {
						MongoClient.connect(dbConfig.url, function (err, db) {
							console.log()
							if (err) throw err;
							var dbo = db.db("test");


							console.log("I am ready to play a game in 620")
							dbo.collection("users").updateOne({
								_id: ObjectId(req.session.user_sid),
								daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
							}, { $inc: { "daily_task_rec.$.state": 1 } },

							)
							console.log("state added 1!!!!!")
							res.send("state added 1!!!!!")

						})
					}
				})
			})




		})




		// app.get('/daily_tasks', function (req, res) {

		// 	function get_stuff_to_send(){

		// 	}


		// 	let state = null;

		// 	MongoClient.connect(dbConfig.url, function (err, db) {
		// 		if (err) throw err;
		// 		var dbo = db.db("test");

		// 		dbo.collection("users").find({
		// 			_id: ObjectId(req.session.user_sid)
		// 		}).toArray(function (err, result) {

		// 			//find the work that needs to be done
		// 			console.log("result.daily_task_rec.state")
		// 			// console.log(result[0].daily_task_rec)
		// 			console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state)

		// 			state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

		// 			//if the state property is less than 3, which indicates that user is 
		// 			//still in the "daily task" user flow.
		// 			if (state < 3) {
		// 				//then we will go to the db and find the number of items
		// 				dbo.collection("daily_tasks").find({
		// 				// 3 - state means the number of items to find	
		// 				}).limit(3 - state).toArray(function (err, data) {



		// 					console.log("the stuff to show -=------------------------------------------")
		// 					console.log(data)

		// 					db.close()



		// 					// MongoClient.connect(dbConfig.url, function (err, db) {
		// 					// 	console.log("added_item")
		// 					// 	console.log(added_item)
		// 					// 	if (err) throw err;
		// 					// 	var dbo = db.db("test");
		// 					// 	dbo.collection("users").updateOne(
		// 					// 		{ _id: ObjectId(req.session.user_sid) },
		// 					// 		{
		// 					// 			$push: { daily_task_archived: { $each: added_item } }
		// 					// 		},
		// 					// 		{ new: true, upsert: true }
		// 					// 	)
		// 					// })

		// 					res.end(res.render(path + "daily_tasks.ejs", {
		// 						todo_item: data,
		// 						navbar: undefined,
		// 						proceed_button: undefined,
		// 						footer: footer
		// 					}));
		// 				});
		// 			}

		// 			else if (state >= 3) {
		// 				res.end(res.render(path + "daily_tasks.ejs", {
		// 					todo_item: undefined,
		// 					navbar: undefined,
		// 					proceed_button: '<button id="proceed" onclick="window.location.href="/minigames"">Proceed</button>',
		// 					footer: footer
		// 				}));
		// 			}
		// 		});

		// 	});







		// 	// let user = null;
		// 	// //indicating how many items left to be added into the array
		// 	// let n_to_go = 0;
		// 	// //used to store the upcoming tasks' ids
		// 	// let go_ahead = []
		// 	// MongoClient.connect(dbConfig.url, function (err, db) {
		// 	// 	if (err) throw err;
		// 	// 	var dbo = db.db("test");
		// 	// 	dbo.collection("users").findOne({
		// 	// 		_id: ObjectId(req.session.user_sid)
		// 	// 	}).then(result => {
		// 	// 		//if the user exists
		// 	// 		if (result) {
		// 	// 			//if the user has not yet finished the tasks
		// 	// 			if (result.daily_task_rec[0].finished_id.length != 0) {
		// 	// 				//the array is needed afterwards
		// 	// 				go_ahead = result.daily_task_rec[0].finished_id;
		// 	// 				//the number of stuff to go
		// 	// 				n_to_go = 3 - go_ahead.length;
		// 	// 			} else {
		// 	// 				n_to_go = 3
		// 	// 				go_ahead = [0]
		// 	// 			}
		// 	// 		}
		// 	// 	}).then(() => { })

		// 	// 	let added_item = []
		// 	// 	//find those that's not in the done list
		// 	// 	dbo.collection("daily_tasks").find({
		// 	// 		"id": { $nin: go_ahead }
		// 	// 	}).limit(n_to_go).toArray((err, daily_tasks) => {

		// 	// 		console.log("go_ahead")
		// 	// 		console.log(go_ahead)
		// 	// 		console.log("n_to_go")
		// 	// 		console.log(n_to_go)
		// 	// 		console.log("daily_tasks")
		// 	// 		console.log(daily_tasks)


		// 	// 		for (var i in daily_tasks) {
		// 	// 			added_item.push(daily_tasks[i].id)
		// 	// 		}
		// 	// 		console.log("=============added===daily_tasks===========================")
		// 	// 		console.log(added_item)

		// 	// 		res.render(path + "daily_tasks.ejs", {
		// 	// 			navbar: undefined,
		// 	// 			todolist: daily_tasks,
		// 	// 			todo_item: daily_tasks,
		// 	// 			footer: footer
		// 	// 		})
		// 	// 	})

		// 	// 	dbo.collection("users").updateOne(
		// 	// 		{ _id: ObjectId(req.session.user_sid) },
		// 	// 		{
		// 	// 			$push: { daily_task_archived: { $each: added_item } }
		// 	// 		},
		// 	// 		{ new: true, upsert: true }

		// 	// 	)

		// 	// 	for (var i in added_item) {
		// 	// 		console.log("==========================added_item[i]")
		// 	// 		console.log(added_item[i])

		// 	// 	}

		// 	// 	db.close();

		// 	// });








		// });





		//THIS FUNCTION CHECKS WHICH STATE THE USER IS IN
		//RETURNS AN INTEGER $GTE 0 && $LTE 7
		app.get("/get_state", sessionChecker2, users.getState)





		app.get('/daily_tasks', sessionChecker2, function (req, res) {
			console.log("req.session.user_sid")
			console.log(req.session.user_sid)

			let state = null;
			let added_item = [];
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, result) {

					let archived = []
					archived = result[0].daily_task_archived;

					//find the work that needs to be done
					console.log("result.daily_task_rec.state")
					// console.log(result[0].daily_task_rec)
					console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state)

					state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

					//if the state property is less than 3, which indicates that user is 
					//still in the "daily task" user flow.
					if (state < 3) {
						console.log("++++++++++++++archived++++++++++++++++++")
						console.log(archived)
						// console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].daily_task_archived)
						console.log(result[0].daily_task_archived)
						//then we will go to the db and find the number of items
						dbo.collection("daily_tasks").find({
							id: { $nin: result[0].daily_task_archived }
							// "3 - state" means the number of items to find 	
						}).limit(3 - state).toArray(function (err, data) {


							//1. this is to get the daily_task's id, and then we will archive the task's id.
							//   we are doing this because the task should not show up in the daily task again if the user has done it already
							console.log("in 708  take a peek at the data schema------------ ")
							// console.log(data[0].id)
							console.log(data)

							//2. before archiving it, we need to push the data into an array, so that 
							//it's easily done.
							for (var index in data) {
								console.log("in 712  the stuff to show---------------------------- ")
								console.log(added_item)
								if (data[index]) {
									added_item.push(data[index].id)
								}

							}

							// close the database to avoid problems from showing up in the update(atomic read)
							db.close()

							console.log("state*8.33==========================================")
							console.log(state * 8.33)
							//connect again to update
							MongoClient.connect(dbConfig.url, function (err, db) {
								//renders the page
								res.end(res.render(path + "daily_tasks.ejs", {
									todo_item: data,
									navbar: navbar_top_ejs,
									proceed_button: undefined,
									footer: footer,
									progress_percentage: state * 8.33 + "%",
									css: result[0].UI_style
								}));


								//after that, archive
								console.log("added_item")
								console.log(added_item)
								console.log("in 727 req.session.user_id------------------------------------")
								console.log(req.session.user_sid)

								if (err) throw err;
								var dbo = db.db("test");


								//push all the items into daily_task_archived
								/*
								if (state < 3) {
									dbo.collection("users").updateOne(
										//find the correct ObjectID
										{
											_id: ObjectId(req.session.user_sid),
											//compare if the date is correct: right on today
											daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
										},
										{
											//push each item
											$addToSet: { daily_task_archived: { $each: added_item } },
											//the $addToSet operator is to avoid repeating the items
											$set: { "daily_task_rec.$.user_id": req.session.user_sid }
										},
										{ new: true, upsert: true }
									)
								}
								*/
							})


						});
					}

					else if (state >= 3) {
						res.end(res.render(path + "daily_tasks.ejs", {
							todo_item: undefined,
							navbar: navbar_top_ejs,
							proceed_button: '<button id="proceed" onclick="window.location.href="/minigames"">Proceed</button>',
							footer: footer,
							progress_percentage: state * 8.33 + "%",
							css: result[0].UI_style
						}));
					}
				});

			});

		});







		//tic tac toe connection, it runs on port 81
		app.get("/games/ttt", (req, res) => {
			res.sendFile(staticPath + "/ttt_game_entrance.html")
		})


		//the route to the snake game
		app.get("/games/snake", (req, res) => {
			res.sendFile(staticPath + "/snake.html")
		})

		//sends the shooter game
		app.get("/games/shooter", (req, res) => {
			res.sendFile(staticPath + "/zombie.html")
		})

		//(not in use) get daily knowledge
		app.route('/getDailyKnowledge').get(users.dailyKnowledge);

		//(not in use)get daily tasks
		app.route('/getDailyTasks').get(users.dailyTasks);

		//BY CLICKING ON THE 
		app.route('/user_profile/getProfile').get(users.getProfile);

		//WHEN THE USER UPDATES THE PROFILE, A POST WILL BE SENT HERE, AND EXCUTES THE CORRESPONDINGG 
		//FUNCTIONS THAT WILL DO THE UPDATE PROFILE WORK.
		app.route('/user_profile/setProfile').post(users.setProfile);



		/////////////////////////////////////////////////////////////////////////////////////////////
		// The Following Functions Are Deprecated And Will Be Removed Later, If Never Brought Back //
		//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//

		//WHEN THIS API IS INVOKED, THE USER'S STATE WILL GO BACK 1
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


		//vote down the daily task(not in use)
		app.route('/getDailyTasks/dislikeTask').post(users.taskDislike);

		//vote up the daily task(not in use)
		app.route('/getDailyTasks/likeTask').post(users.taskLike);


		app.route('/getDailyTasks/dislikeKnowledge').post(users.knowledgeDislike);
		app.route('/getDailyTasks/likeKnowledge').post(users.knowledgeLike);


		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		// The Above Functions Are Deprecated And Will Be Removed Later, If Never Brought Back      //
		//////////////////////////////////////////////////////////////////////////////////////////////


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
				res.render(path + 'login.ejs', { css: req.session.ui_choice });
			})

		// A ROUTE THE USER WILL VISIT WHEN CLICKING ON THE LOGOUT BUTTON
		// THE API INVOKES 
		app.get('/logout', (req, res) => {
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("users").updateOne(
					//find the correct ObjectID
					{
						_id: ObjectId(req.session.user_sid),
						daily_task_rec: { $elemMatch: { "state": { $lte: 10 }, date: { $lte: new Date() } } },
					},
					{

						//set the state back to 0 for testing 
						$set: { "daily_task_rec.$.state": 0 }
					}
				)

				db.close()
				res.clearCookie('user_sid');
				req.session = null;
				res.redirect('/login');
			});




		})

		//VISITS THE 'MY RECORD' PAGE WHERE CHARTS AND GRAPHS ARE PRESENTED
		app.get("/my_record", (req, res) => {
			res.render(path + "my_record.ejs", {
				navbar: navbar_top_ejs,
				footer: undefined,
				css: undefined
			})
			// res.sendFile(path + "record.html")
		})


		//THIS ROUTE GET'S THE USER'S INFORMATION AND SENDS IT TO THE FRONTT END. 
		app.get("/record", (req, res) => {
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");

				//find the user by session ID
				dbo.collection("users").find({
					_id: ObjectId(req.session.user_sid)
				}).toArray(function (err, theUser) {

					result = theUser[0],
						res.send(result)


				})
				db.close()
			})
		})

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

		//
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

		//goes to the ADMIN'S HOME page
		app.get('/admin_home', (req, res) => {
			res.render(path + "admin_home.ejs");
		});

		//
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

		//posts the user password to check if the person is an admin
		app.post('api/users/admin', (req, res) => {
			users.verifyAdmin
		});

		//add one coupon to the db
		app.post('/coupon/add', (req, res) => {

			console.log(req.body)

			// MongoClient.connect(dbConfig.url, function (err, db) {


			// 	if (err) throw err;
			// 	var dbo = db.db("test");
			// 	dbo.collection("coupons_available").find({}).count().toArray((err, num_of_coupons_available) => {

			// 		console.log("num_of_coupons_available")
			// 		console.log(num_of_coupons_available)

			// 		db.close()

			// 		//connect
			// 		MongoClient.connect(dbConfig.url, function (err, db) {
			// 			if (err) throw err;
			// 			var dbo = db.db("test");

			// 			dbo.collection("coupons_available").updateOne(
			// 				//find the correct ObjectID
			// 				{
			// 				},
			// 				{
			// 					//push each item
			// 					$addToSet: { id: num_of_coupons_available },
			// 					//the $addToSet operator is to avoid repeating the items
			// 					$set: { "daily_task_rec.$.user_id": req.session.user_sid }
			// 				},
			// 				{ new: true, upsert: true }
			// 			)
			// 		})
			// 	})




			// })
		});


		//BY VISITING "/coupon/delete" THE ADMIN CAN DELETE A COUPON BY ITS ID(INVOKED UPON CLICKING ON THE BTN)
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










	//THIS FUNCTION CHECKS WHICH STATE THE USER IS IN
	//RETURNS AN INTEGER $GTE 0 && $LTE 7
	app.get("/get_state", sessionChecker2, users.getState)





	app.get('/daily_tasks', sessionChecker2, function (req, res) {
		console.log("req.session.user_sid")
		console.log(req.session.user_sid)

		let state = null;
		let added_item = [];
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {

				let archived = []
				archived = result[0].daily_task_archived;

				//find the work that needs to be done
				console.log("result.daily_task_rec.state")
				// console.log(result[0].daily_task_rec)
				console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state)

				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state;

				//if the state property is less than 3, which indicates that user is 
				//still in the "daily task" user flow.
				if (state < 3) {
					console.log("++++++++++++++archived++++++++++++++++++")
					console.log(archived)
					// console.log(result[0].daily_task_rec[result[0].daily_task_rec.length - 1].daily_task_archived)
					console.log(result[0].daily_task_archived)
					//then we will go to the db and find the number of items
					dbo.collection("daily_tasks").find({
						id: { $nin: result[0].daily_task_archived }
						// "3 - state" means the number of items to find 	
					}).limit(3 - state).toArray(function (err, data) {


						//1. this is to get the daily_task's id, and then we will archive the task's id.
						//   we are doing this because the task should not show up in the daily task again if the user has done it already
						console.log("in 708  take a peek at the data schema------------ ")
						// console.log(data[0].id)
						console.log(data)

						//2. before archiving it, we need to push the data into an array, so that 
						//it's easily done.
						for (var index in data) {
							console.log("in 712  the stuff to show---------------------------- ")
							console.log(added_item)
							if (data[index]) {
								added_item.push(data[index].id)
							}

						}

						// close the database to avoid problems from showing up in the update(atomic read)
						db.close()

						console.log("state*8.33==========================================")
						console.log(state * 8.33)
						//connect again to update
						MongoClient.connect(dbConfig.url, function (err, db) {
							//renders the page
							res.end(res.render(path + "daily_tasks.ejs", {
								todo_item: data,
								navbar: navbar_top_ejs,
								proceed_button: undefined,
								footer: footer,
								progress_percentage: state * 8.33 + "%",
								css: result[0].UI_style
							}));


							//after that, archive
							console.log("added_item")
							console.log(added_item)
							console.log("in 727 req.session.user_id------------------------------------")
							console.log(req.session.user_sid)

							if (err) throw err;
							var dbo = db.db("test");


							//push all the items into daily_task_archived
							/*
							if (state < 3) {
								dbo.collection("users").updateOne(
									//find the correct ObjectID
									{
										_id: ObjectId(req.session.user_sid),
										//compare if the date is correct: right on today
										daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } } }
									},
									{
										//push each item
										$addToSet: { daily_task_archived: { $each: added_item } },
										//the $addToSet operator is to avoid repeating the items
										$set: { "daily_task_rec.$.user_id": req.session.user_sid }
									},
									{ new: true, upsert: true }
								)
							}
							*/
						})


					});
				}

				else if (state >= 3) {
					res.end(res.render(path + "daily_tasks.ejs", {
						todo_item: undefined,
						navbar: navbar_top_ejs,
						proceed_button: '<button id="proceed" onclick="window.location.href="/minigames"">Proceed</button>',
						footer: footer,
						progress_percentage: state * 8.33 + "%",
						css: result[0].UI_style
					}));
				}
			});

		});

	});






	// require csvtojson
	var csv = require("csvtojson");
	let csvFilePath = staticPath + "BCCDC_COVID19_Dashboard_Case_Details.csv"
	//  // Convert a csv file with csvtojson


	// // Parse large csv with stream / pipe (low mem consumption)
	// csv()
	// 	.fromStream(readableStream)
	// 	.subscribe(function (jsonObj) { //single json object will be emitted for each csv line
	// 		// parse each json asynchronousely
	// 		return new Promise(function (resolve, reject) {
	// 			asyncStoreToDb(json, function () { resolve() })
	// 		})
	// 	})

	// //Use async / await
	// const jsonArray = await csv().fromFile(filePath);


	app.get("/parse_covid_line_data", (req, res) => {

		try {

			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("covid_data").aggregate(
					[{ $unwind: "$Reported_Date" }, { $sortByCount: "$Reported_Date" }]
				).sort({ _id: 1 }).toArray(function (err, infected) {

					console.log(infected)
					res.send(infected)
				})
				db.close()
			})
		} catch (e) {
			console.log(e);
		}

		// console.log(csvFilePath)
		// csv().fromFile(csvFilePath)
		// 	.then(function (jsonArrayObj) { //when parse finished, result will be emitted here.
		// 		try {
		// 			console.log("about to insert");
		// 			MongoClient.connect(dbConfig.url, function (err, db) {
		// 				if (err) throw err;
		// 				var dbo = db.db("test");
		// 				dbo.collection("covid_data").insertMany(
		// 					jsonArrayObj
		// 				)
		// 			})
		// 		} catch (e) {
		// 			console.log(e);
		// 		}
		// 	})
	})



	const https = require('https');
	app.get("/COVID_NEWS", (req, res) => {
	
		
		var myPath = "https://newsapi.org/v2/top-headlines?country=ca&category=health&apiKey=8295de78f914447abfe4bc0c56f3d234";
		

		https.get(myPath, (resp) => {
		  let data = '';
		
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });
		
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			console.log(JSON.parse(data).articles[0]);
			res.send(JSON.parse(data).articles)
		  });
		
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
		
	})












	app.get("/pandemic_info", (req, res) => {

		res.render(path + "pandemic_info.ejs",{navbar:navbar_top_ejs})
	})



	app.get("/parse_covid_bar_data", (req, res) => {

		try {
			console.log("about to insert");
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("covid_data").aggregate(
					[{ $unwind: "$HA" }, { $sortByCount: "$HA" }]
				).sort({ _id: 1 }).toArray(function (err, infected) {

					console.log(infected)
					res.send(infected)
				})
				db.close()
			})
		} catch (e) {
			console.log(e);
		}
	})








	app.get("/chatbox",(req,res)=>{
		res.render(path + "chatbox.ejs")
	})

	//tic tac toe connection, it runs on port 81
	app.get("/games/ttt", (req, res) => {
		res.sendFile(staticPath + "/ttt_game_entrance.html")
	})


	//the route to the snake game
	app.get("/games/snake", (req, res) => {
		res.sendFile(staticPath + "/snake.html")
	})

	//sends the shooter game
	app.get("/games/shooter", (req, res) => {
		res.sendFile(staticPath + "/zombie.html")
	})

	//(not in use) get daily knowledge
	app.route('/getDailyKnowledge').get(users.dailyKnowledge);

	//(not in use)get daily tasks
	app.route('/getDailyTasks').get(users.dailyTasks);

	//BY CLICKING ON THE 
	app.route('/user_profile/getProfile').get(users.getProfile);

	//WHEN THE USER UPDATES THE PROFILE, A POST WILL BE SENT HERE, AND EXCUTES THE CORRESPONDINGG 
	//FUNCTIONS THAT WILL DO THE UPDATE PROFILE WORK.
	app.route('/user_profile/setProfile').post(users.setProfile);



	/////////////////////////////////////////////////////////////////////////////////////////////
	// The Following Functions Are Deprecated And Will Be Removed Later, If Never Brought Back //
	//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//

	//WHEN THIS API IS INVOKED, THE USER'S STATE WILL GO BACK 1
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


	//vote down the daily task(not in use)
	app.route('/getDailyTasks/dislikeTask').post(users.taskDislike);

	//vote up the daily task(not in use)
	app.route('/getDailyTasks/likeTask').post(users.taskLike);


	app.route('/getDailyTasks/dislikeKnowledge').post(users.knowledgeDislike);
	app.route('/getDailyTasks/likeKnowledge').post(users.knowledgeLike);


	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	// The Above Functions Are Deprecated And Will Be Removed Later, If Never Brought Back      //
	//////////////////////////////////////////////////////////////////////////////////////////////


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
			res.render(path + 'login.ejs', { css: req.session.ui_choice });
		})

	// A ROUTE THE USER WILL VISIT WHEN CLICKING ON THE LOGOUT BUTTON
	// THE API INVOKES 
	app.get('/logout', (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			dbo.collection("users").updateOne(
				//find the correct ObjectID
				{
					_id: ObjectId(req.session.user_sid),
					daily_task_rec: { $elemMatch: { "state": { $lte: 10 }, date: { $lte: new Date() } } },
				},
				{

					//set the state back to 0 for testing 
					$set: { "daily_task_rec.$.state": 0 }
				}
			)

			db.close()
			res.clearCookie('user_sid');
			req.session = null;
			res.redirect('/login');
		});




	})

	//VISITS THE 'MY RECORD' PAGE WHERE CHARTS AND GRAPHS ARE PRESENTED
	app.get("/my_record", (req, res) => {
		res.render(path + "my_record.ejs", {
			navbar: navbar_top_ejs,
			footer: undefined,
			css: undefined
		})
		// res.sendFile(path + "record.html")
	})


	//THIS ROUTE GET'S THE USER'S INFORMATION AND SENDS IT TO THE FRONTT END. 
	app.get("/record", (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			//find the user by session ID
			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, theUser) {

				result = theUser[0],
					res.send(result)


			})
			db.close()
		})
	})

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

	//
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

	//goes to the ADMIN'S HOME page
	app.get('/admin_home', (req, res) => {
		res.render(path + "admin_home.ejs");
	});

	//
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

	//posts the user password to check if the person is an admin
	app.post('api/users/admin', (req, res) => {
		users.verifyAdmin
	});

	//add one coupon to the db
	app.post('/coupon/add', (req, res) => {

		console.log(req.body)

		// MongoClient.connect(dbConfig.url, function (err, db) {


		// 	if (err) throw err;
		// 	var dbo = db.db("test");
		// 	dbo.collection("coupons_available").find({}).count().toArray((err, num_of_coupons_available) => {

		// 		console.log("num_of_coupons_available")
		// 		console.log(num_of_coupons_available)

		// 		db.close()

		// 		//connect
		// 		MongoClient.connect(dbConfig.url, function (err, db) {
		// 			if (err) throw err;
		// 			var dbo = db.db("test");

		// 			dbo.collection("coupons_available").updateOne(
		// 				//find the correct ObjectID
		// 				{
		// 				},
		// 				{
		// 					//push each item
		// 					$addToSet: { id: num_of_coupons_available },
		// 					//the $addToSet operator is to avoid repeating the items
		// 					$set: { "daily_task_rec.$.user_id": req.session.user_sid }
		// 				},
		// 				{ new: true, upsert: true }
		// 			)
		// 		})
		// 	})




		// })
	});


	//BY VISITING "/coupon/delete" THE ADMIN CAN DELETE A COUPON BY ITS ID(INVOKED UPON CLICKING ON THE BTN)
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