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


	//THIS IS THE MODULE TO RUN HTTP SERVER.
	var express = require("express");

	//PURE-JAVASCRIPT IMPLEMENTATION OF MANY WEB STANDARDS,
	const { JSDOM } = require('jsdom');


	var router = express.Router();


	const fs = require('fs');



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







	//EXPRESS-SESSION IS FOR DEALING WITH SESSION REQUESTS
	//IT IS NECESSARY FOR A RESTFUL API.
	var session = require('express-session');

	app.use(cookieParser());
	app.use(session({
		key: 'user_sid',
		// user_sid :null,
		secret: 'hard work',
		resave: false,
		saveUninitialized: false,

		cookie: {

			expires: 600000000
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

	//CHECKS IF THE USER HAS LOGGED IN OR NOT, (CREATED FOR TESTING PURPOSES, NOT IN USE)
	app.get('/checkstatus', sessionChecker, (req, res) => {
		res.redirect('/login');
		res.end();
	});


	//THE COUPON PAGE LINK, THE USER WILL BE SENT A LIST OF COUPONS
	app.get('/coupon', sessionChecker2, users.getCoupon);

	// var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
	var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs", 'utf-8');

	//THE FOOTER COMPONENT OF THE PAGES, IT'S A EJS
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

				//FETCH THE ITEMS OF THE USER'S OWNED COUPONS FROM THE LIST 
				coupon_id_array = result[0].coupons_owned;

				dbo.collection("coupons_available").find({
					id: { $in: coupon_id_array }
				}).limit(5).toArray(function (err, data) {

					console.log(data)
					res.end(res.render(path + "my_coupons.ejs", {
						coupons: data,
						navbar: navbar_top_ejs,
						footer: footer,
						css: result[0].UI_style,
						progress_bar: undefined
					}));
				});
			});
		});
	}

	);

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

		console.log("req.session.UI_style in --------------LINE 295--------------")
		console.log(req.session.UI_style)


		//STATE IS A GLOBAL VARIABLE, WHICH WILL BE GRANTED VALUE LATER.
		//MAKE IT NULL IS FOR CHECKING.
		let state = null;

		//CONNECTION PHRASE
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			//THE QUERY IS TO SEARCH THE USER'S STAE FROM THE DB.
			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {

				state = result[0].daily_task_rec[result[0].daily_task_rec.length - 1].state
				console.log("------------------got  state====================LINE 313 in user.route")
				console.log(state)

				//THE USER HAS NOT YET FINISHED THE DAILY TASKS
				if (state <= 3) {
					res.redirect("/daily_tasks")
				}

				//BETWEEN STATE 4 AND 5 ARE THE GAME PLAY.
				else if (state >= 4 && state <= 5) {
					users.addPoints(req, res, 10)
					res.redirect("/minigames")
				}

				//AT THE STATE OF 6, THE USER WILL BE DIRECTED TO /coupon
				else if (state > 5 && state <= 6) {
					res.redirect("/coupon")
				}

				//THE UI STYLE IS PLUGGED FROM THE DB.
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


	//IT SET'S THE STAET BACK TO ZERO ON THE USER'S EXIT.
	app.get("/set_state_back_to_zero", (req, res) => {
		MongoClient.connect(dbConfig.url, function (err, db) {
			console.log()
			if (err) throw err;
			var dbo = db.db("test");


			console.log("I am ready to play a game in 620")
			dbo.collection("users").updateOne({
				_id: ObjectId(req.session.user_sid),
				daily_task_rec: { $elemMatch: { date: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } }
			}, { $set: { "daily_task_rec.$.state": -1 } },

			)
			console.log("state added 1!!!!!")
			res.render(path + "/homepage.ejs", {
				navbar: navbar_top_ejs,
				footer: footer,
				css: req.session.UI_style
			})

		})
	})


	//ON ENTERING THE MINIGAME PAGE
	app.get("/minigames", sessionChecker2, (req, res) => {

		let state = null;

		//FIRST CONNECT AND CHECK THE STATE THE USER IS CURRENTLY IN
		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			dbo.collection("users").find({
				_id: ObjectId(req.session.user_sid)
			}).toArray(function (err, result) {

				//THE "STATE" PROPERTY IS STORED IN THE FOLLOWING DATA STRUCTURE IN THE DB:
				//RESULT[0].DAILY_TASK_REC[RESULT[0].DAILY_TASK_REC.LENGTH - 1].STATE;
				//WHILE THE VARIABLE "STATE" GETS ACCESS TO THE DATA.
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
				//THE USER WILL BE DIRECTED BACK TO THE HOMEPAGE FOR NOT VISITING THE RIGHT PAGE AT THIS STATE.
				else if (state < 4) {
					res.redirect('/homepage');
				}
				//THE USER HAS FINISHED PLAYING A GAME SO IT IS ALLOWED TO PROCEED. 
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

				//THIS IS THE STATE TO SEND THE GAME SELECTION PAGE.
				//THIS IS IN THE USER FLOW OF PLAYING A GAME SO NO PROCEED BUTTON WILL BE GIVEN.
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
				//THE 
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

	//POSTS THE USER'S UCI MESSAGE TO THE STOCKFISH
	app.post("/minigames/chess", (req, res) => {
		console.log("req.body")
		console.log(req.body)
		var next_move = []
		console.log("uci-=================================================")
		console.log(req.body["uci"])
		stockfishes[id].postMessage(uci[id] + " " + req.body["uci"]);
		uci[id] = uci[id] + " " + req.body["uci"]
		console.log("-=----PLAYER--=-=-=-=-=-=-uic[id]-=-=-=-=-=-=-=-=-=-=-=-=");
		console.log(uci[id]);
		stockfishes[id].postMessage("go infinite");
		setTimeout(() => {
			stockfishes[id].postMessage("stop");
			stockfishes[id].postMessage("d");
		}, 100);

		//STOCKFISH LIBRARY FUNCTION, INVOKED ON RECEIVING A UCI MESSAGE.
		stockfishes[id].onmessage = function (message) {
			//GET THE KEYWORD WHERE THE STOCKFISH RETURNS A BESTMOVE
			//KEY WORD.
			if (message.startsWith("bestmove")) {
				//THE NEXT MOVE WILL BE SPLIT BY SPACES.
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



	//THIS IS THE PAGE THE USER WILLL SEE UPON VISITING THE ROOT
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

	app.get("/counselling", sessionChecker2, (req, res) => {
		res.render(path + "counselling.ejs", { navbar: navbar_top_ejs })
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
		console.log("673 req.body=====================================")
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


	//VOTE DOWN THE DAILY TASK (WRITTEN FOR FORMER FUNCTIONS BUT ARE NOT IN USE NOW)
	app.route('/getDailyTasks/dislikeTask').post(users.taskDislike);

	//VOTE UP THE DAILY TASK (WRITTEN FOR FORMER FUNCTIONS BUT ARE NOT IN USE NOW)
	app.route('/getDailyTasks/likeTask').post(users.taskLike);

	//VOTE DOWN THE DAILY TASK (WRITTEN FOR FORMER FUNCTIONS BUT ARE NOT IN USE NOW)
	app.route('/getDailyTasks/dislikeKnowledge').post(users.knowledgeDislike);

	//VOTE DOWN THE DAILY TASK (WRITTEN FOR FORMER FUNCTIONS BUT ARE NOT IN USE NOW)
	app.route('/getDailyTasks/likeKnowledge').post(users.knowledgeLike);


	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	// The Above Functions Are Deprecated And Will Be Removed Later, If Never Brought Back      //
	//////////////////////////////////////////////////////////////////////////////////////////////


	// //=====================REGISTER PAGE=================================================================================

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












	//THIS FUNCTION CHECKS WHICH STATE THE USER IS IN
	//RETURNS AN INTEGER $GTE 0 && $LTE 7
	app.get("/get_state", sessionChecker2, users.getState)




	//BY VISITING THIS YOU ARE DIRECTED TO THE daily_tasks PAGE
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


				if (state == -1) {
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
						res.redirect("/daily_tasks")

					})

				}
				//if the state property is not -1 but also less than 3, which indicates that user is 
				//still in the "daily task" user flow.
				else if (state >= 0 && state < 3) {
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
								if (index <= 2)
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



	// // Parse large csv with stream / pipe (low mem consumption)
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
	})



	//LATEST NEWS start
	//GETS LATEST NEWS USING NEWS API
	//Source:  https://newsapi.org/
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

	//LATEST NEWS start
	//GETS LATEST NEWS USING NEWS API
	//Source:  https://newsapi.org/

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//	USING REQUEST MODULE TO DOWNLOAD THE COVID DATA FROM BCCDC
	/////////////////////////////////////////////////////////////////////////////////////////////////////


	//Scheduled web-push notification:
	//This Scheduled web-push notification block of code was adapted from code found here:
	//Source:https://learn.bcit.ca/d2l/le/content/620723/viewContent/4590304/View
	/*Content:
	  cron.scheduleJob('15 ' + result[0].remind_time.minute+' '+result[0].remind_time.hour+' * * *', function () {
	
	//             push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)
	
	//             push.sendNotification(JSON.parse(sub), 'test message')
	
	//             console.log('This runs at the 45th second of every minute.');
	//         });
	//         // push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)
	
	//         // push.sendNotification(JSON.parse(sub), 'test message')
	//     })
	
	
	*/


	const request = require('request')
	const cron = require('node-schedule');




	//DOWNLOAD FILE HTTP start
	//Download files using http request:
	//This block of code can be found in https://flaviocopes.com/node-download-image/

	async function updateLatestData() {
		const download = (url, path, callback) => {
			request.head(url, (err, res, body) => {
				request(url)
					.pipe(fs.createWriteStream(path))
					.on('close', callback)
			})
		}

		const url = 'http://www.bccdc.ca/Health-Info-Site/Documents/BCCDC_COVID19_Dashboard_Case_Details.csv'
		const path = staticPath + "BCCDC_COVID19_Dashboard_Case_Details.csv"

		download(url, path, () => {
			console.log('✅ Done!')
		})
	}
	//DOWNLOAD FILE HTTP end
	//Download files using http request:
	//This block of code can be found in https://flaviocopes.com/node-download-image/


	// REQUIRE CSVTOJSON
	var csv = require("csvtojson");
	var csvFilePath = staticPath + "BCCDC_COVID19_Dashboard_Case_Details.csv"

	//每小时的第1分钟的第一秒，重新下载BCCDC的csv文件，然后把库给删了，再重新导入一次
	//UPDATES THE CSV FROM BCCDC ONCE AN HOUR, AT THE FIRST SECOND OF THE FIRST MINUTE
	cron.scheduleJob('1 17 * * * *', function () {
		updateLatestData().then(() => {
			try {
				console.log("DeleteFormerData");
				MongoClient.connect(dbConfig.url, function (err, db) {
					if (err) throw err;
					var dbo = db.db("test");
					dbo.collection("covid_data").remove()
				})
			} catch (e) {
				console.log(e);
			}


		}).then(
			() => {

				//CSV JSON CONVERSION start 
				//Convert a csv file with csvtojson
				//SOUCE: https://stackoverflow.com/questions/16831250/how-to-convert-csv-to-json-in-node-js
				console.log(csvFilePath)
				csv().fromFile(csvFilePath)
					.then(function (jsonArrayObj) { //when parse finished, result will be emitted here.
						try {
							console.log("about to insert");
							MongoClient.connect(dbConfig.url, function (err, db) {
								if (err) throw err;
								var dbo = db.db("test");
								dbo.collection("covid_data").insertMany(
									jsonArrayObj
								)
							})
						} catch (e) {
							console.log(e);
						}
					})
			}
		)

	})
	//CSV JSON CONVERSION end 
	//Convert a csv file with csvtojson
	//SOUCE: https://stackoverflow.com/questions/16831250/how-to-convert-csv-to-json-in-node-js




	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	//							BCCDC DATA ACQUIRING AND PROCESSING
	//////////////////////////////////////////////////////////////////////////////////////////////////////////






	///////////////////////////////////////////////////////////////////////////////////////////////////////
	//					MONGODB MONITORING SCHEDULED PUSH FUNCTION
	///////////////////////////////////////////////////////////////////////////////////////////////////////


	var push = require('web-push')
	cron.scheduleJob('10 * * * * *', function () {

		MongoClient.connect(dbConfig.url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("test");

			try {
				console.log("hour")
				console.log(new Date().getHours())
				console.log("minute")
				console.log(new Date().getMinutes())
				dbo.collection("users").find(
					{
						remind_time: { hour: new Date().getHours(), minute: new Date().getMinutes() }
					}
				).toArray((err, result) => {

					console.log(result)
					for (var index in result) {


						if (result[index].vapidKeys && result[index].sub) {

							console.log("vapidKeys")
							let vapidKeys = result[index].vapidKeys;
							console.log(vapidKeys)
							let sub_info = result[index].sub
							//
							//PUSH START
							//SOURCE:https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications?hl=fr
							//HELPED BY SOURCE
							push.setVapidDetails('futurecudrves:test@judaozhong.com', vapidKeys.publicKey, vapidKeys.privateKey)
							push.sendNotification(JSON.parse(sub_info), 'test message')
							//PUSH END
							//SOURCE:https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications?hl=fr
							//HELPED BY SOURCE
						}


					}
					console.log('This runs at the 10 th second of every minute.')
					console.log("Checks the DB for the list of pushes and then reminds the user")
					console.log("done!")

				
				})
			} catch (e) {
				console.log(e)
			} finally {
				db.close()
				console.log("Notification Function Done")
			}


		})
	})
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//


	//ON CALLING THIS ROUTE, THE USER IS LEAD TO THE PANDEMIC INFORMATION 
	app.get("/pandemic_info", (req, res) => {

		res.render(path + "pandemic_info.ejs", { navbar: navbar_top_ejs })
	})


	//THIS IS AN API TO GET COVID STATISTICS BY USING MONGODB $unwind AND $sortBycount
	//FUNCTION,THEN THIS WILL BE SENT TO THE DATABASE.
	app.get("/parse_covid_bar_data", (req, res) => {

		try {
			console.log("about to insert");
			MongoClient.connect(dbConfig.url, function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				dbo.collection("covid_data").aggregate(
					[{ $unwind: "$HA" }, { $sortByCount: "$HA" }]
				).sort({ _id: 1 }).toArray(function (err, infected) {
					console.log("infected people count in line 1379")
					console.log(infected)
					res.send(infected)
				})
				db.close()
			})
		} catch (e) {
			console.log(e);
		}
	})







	//THE CHATBOX IS THE SOCKEIT.IO CHAT APP
	app.get("/chatbox", (req, res) => {
		res.render(path + "chatbox.ejs", {
			navbar: navbar_top_ejs
		})
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

	//get api key and send to the front end
	app.post("/getKey", (req, res) => {
		res.send('BHzTemBBukw8OY7qXGqtXPPIGSr-TyACw3rNEcmsBTx2gEJQ2YECWff5oBMb9fRss7vhn3a6ATNxucmb52zHM2U')
	})

	//imported for dealing with submitted pictures
	var formidable = require('formidable');

	//THIS IS AN API PROVIDED TO THE USER TO CHECK THE SYSTEM TIME.
	app.post("/check_time", (req, res) => {
		console.log("time should be in here++++++++++++++++++++++++++++++")
		let client_timestamp = Date.parse(req.body.d)
		let server_timestamp = Date.now();

		//IF THE CLIENT TIME EXCEEDS 5AM
		//AND THE CLIENT HAS NOT DONE ALL THE TASKS
		//GO AND FIND THE STUFF IN THE DB.
		//IN THE RESULT ARRAY, LOOK FOR THOSE WITH "TRUE" -> RENDER DIFFERENTLY
		//                     LOOK FOR THOSE WITH "FALSE"-> RENDER NORMALLY

		if (client_timestamp > server_timestamp + 3600 * 1000 * 12 || client_timestamp < server_timestamp - 3600 * 1000 * 12) {
			console.log("the user is trying to cheat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
		}
		else {
			console.log("the user is finishing all the tasks")
		}
	})

	//THIS UPLOADS THE AVATAR TO THE SERVER.
	//Source: https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
	/*content:
			//IF THE USER'S AVATAR FOLDER IS NOT THERE, IT CREATES A FOLDER FOR IT 
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				//IF THE AVATAR EXISTS, THEN 
				if (fs.existsSync(dir)) {
					fs.writeFileSync(dir + "/avatar.png", fs.readFileSync(files.upload.path));
					res.redirect("/user_profile");
				}
	*/

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

				//IF THE USER'S AVATAR FOLDER IS NOT THERE, IT CREATES A FOLDER FOR IT 
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				//IF THE AVATAR EXISTS, THEN 
				if (fs.existsSync(dir)) {
					fs.writeFileSync(dir + "/avatar.png", fs.readFileSync(files.upload.path));
					res.redirect("/user_profile");
				}
			} else {
				res.redirect("/checkstatus")
			}
		});
	});

	//ADMIN WILL BE VISITING THIS LINK
	app.get('/admin', (req, res) => {
		res.render(path + "admin_verify.ejs");
	});

	//goes to the ADMIN'S HOME page
	app.get('/admin_home', (req, res) => {
		res.render(path + "admin_home.ejs");
	});

	//THIS API FINDS ALL THE COUPONS AND SHOW THEM TO THE ADMIN.
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
				//RENDERS THE WHOLE PAGE TO THE USER
				res.render(path + "admin_coupon.ejs", { todolist: render });
				console.log("RENDERED===================================");
			});

		});
	});

	//posts the user password to check if the person is an admin
	app.post('api/users/admin', (req, res) => {
		users.verifyAdmin
	});

	//add one coupon to the db
	app.post('/coupon/add', (req, res) => {

		console.log(req.body)

	});











	//ANY OTHER ROUTE WILL RESULT IN A 404 PAGE.
	app.use('*', (req, res) => {
		res.sendFile(path + "404.html");
	});











}