var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Pg = require('../models/pg');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

//checking  authentication
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

// //openlist
// router.get('/openlist', ensureAuthenticated, function(req, res){
// 	Pg.find({},function(err,result){
// 		res.render('openlist',{result:result});
// 	});
// });

//openlist
router.get('/openlist', ensureAuthenticated, function(req, res){
	Pg.find({},function(err,result){
		res.render('openlist',{result:result});
	});
});

// //searching location
// router.post("/search", (req, res) => {
// 	if (req.body.search != "") {
// 	  Story.find({ related: { $in: [req.body.search] }, status: "public" })
// 		.populate("user")
// 		.sort({ date: "desc" })
// 		.then(stories => {
// 		  res.render("stories/index", {
// 			search: req.body.search,
// 			stories: stories
// 		  });
// 		});
// 	} else {
// 	  Story.find({ status: "public" })
// 		.populate("user")
// 		.sort({ date: "desc" })
// 		.then(stories => {
// 		  res.render("stories/index", {
// 			stories: stories
// 		  });
// 		});
// 	}
//   });

//userprofile
//openlist
router.get('/userprofile', ensureAuthenticated, function(req, res){
	res.render('userprofile');
});

//pgview
router.get('/pgview', ensureAuthenticated, function(req, res){
	res.render('pgview');
});

//enterpg
router.get('/enterpg', ensureAuthenticated, function(req, res){
	res.render('enterpg');
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;
    	if(!user){
    		return done(null, false, {message: 'Unknown User'});
    	}
    	User.comparePassword(password, user.password, function(err, isMatch){
    		if(err) throw err;
    		if(isMatch){
    			return done(null, user);
    		}
    		else {
    			return done(null, false, {message: 'Invalid password'});
    		}
    	});
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});


// Register PG
router.post('/enterpg', function (req, res) {
	var Name = req.body.Name;
	var Pno = req.body.Pno;
	var Email = req.body.Email;
	var Pname = req.body.Pname;
	var Loco = req.body.Loco;
	var Troom = req.body.Troom;
	var Vroom = req.body.Vroom;
	var Sharing = req.body.Sharing;
	var Rent = req.body.Rent;
	var Extras = req.body.Extras;
	console.log(req.body);

					var newPg = new Pg({
						Name: Name,
						Pno: Pno,
						Email: Email,
						Pname: Pname,
						Loco: Loco,
						Troom: Troom,
						Vroom: Vroom,
						Sharing: Sharing,
						Rent: Rent,
						Extras: Extras
					});
					Pg.createPg(newPg, function (err, pg) {
						if (err) throw err;
						//console.log(pg);
					});
			 req.flash('success_msg', 'You Pg is Registered');
					res.redirect('/users/login');
			});
module.exports = router;