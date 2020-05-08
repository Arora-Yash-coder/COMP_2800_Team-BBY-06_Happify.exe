module.exports = function (app) {
	var http = require("http");
	var express = require("express");
	var router = express.Router();
	const fs = require('fs');
	// const ejs = require('ejs');
	const users = require('../controllers/user.controller.js');

	var path = __basedir + '/views/';
	global.path = path;

	router.use(function (req, res, next) {
		console.log("/" + req.method);
		next();
	});


	var navbar_top_ejs = fs.readFileSync(path + "components/navbar_top.ejs",'utf-8');
	var body_ejs = fs.readFileSync(path + "components/homepage_body.ejs", 'utf-8');
	var toolbar_bottom = fs.readFileSync(path + "components/toolbar_bottom.ejs", 'utf-8');
	
	app.get('/', (req, res) => {
		res.end(res.render(path + "homepage.ejs", {
			navbar: navbar_top_ejs,
			body: body_ejs,
			toolbar: toolbar_bottom,
		}));
	});
	app.get('/AboutUs', (req, res) => {
		res.end(res.render(path + "AboutUS.ejs", {
			navbar: navbar_top_ejs,
			toolbar: toolbar_bottom,
		}));
	});
	app.get('/success', (req, res) => {
		res.sendFile(path + "successful.html");
	});

	app.get('/login', (req, res) => {
		res.sendFile(path + "login.html");
	});

	app.get('/:username', (req, res) => {
		res.sendFile(path + "successful.html");
	});
	

	// Save a User to MongoDB
	app.post('/api/users/register', users.register);

	// Retrieve all Users
	app.get('/api/users/all', users.findAll);

	app.post('/api/users/verify', users.verify);

	app.use("/", router);



	app.get("/test", (req, res) => {
		res.sendFile(path + "test.html")
	});

	app.use("/success", router);

	app.get("/game/ttt", (req, res) => {
		res.status(301).redirect("http://localhost:81")

	})

	app.use("*", (req, res) => {
		res.sendFile(path + "404.html");
	});
}