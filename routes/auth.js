var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

var User = require('../models/user');
var Cert = require('../models/cert');

// Register
router.get('/register', function(req, res){
	res.render('./index/register');
});

// Local Login
router.get('/login', function(req, res){
	res.render('./index/login');
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/dashboard', failureRedirect:'/auth/login',failureFlash: true}),
  function(req, res) {
  	req.flash('success_msg', 'You are logged in');
    res.redirect('/cert');
  });

// Register User
router.post('/register', function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstName', 'First name is required').notEmpty();
	req.checkBody('lastName', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		console.log(errors);
		res.render('./index/register',{
			errors:errors
		});
	} else {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ email :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
              req.flash('error_msg', 'Email already in use');
				      res.redirect('./login');
            } else {

                // if there is no user with that email
                var newUser = new User({
        					firstName: firstName,
        					lastName: lastName,
        					email: email,
        					password: password
        				});

                // save the user
                User.createUser(newUser, function(err, user){
					if(err) throw err;
					console.log(user);
				});
                req.flash('success_msg', 'You are registered and can now login');
				res.redirect('./login');
            }
        });

        };
});

//google login
router.get('/google', passport.authenticate('google',
{scope: ['profile', 'email']}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login'}),
  (req, res) => {
    req.flash('success_msg', 'You are logged in');
    res.redirect('/cert');
  });

//Facebook
router.get('/facebook',
  passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success_msg', 'You are logged in');
    res.redirect('/cert');
  });




router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/auth/login');
});

module.exports = router;
