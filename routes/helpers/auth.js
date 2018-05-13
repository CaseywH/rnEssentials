var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

var User = require('/Users/casey/projects/rnessentials/models/user.js');
var Cert = require('/Users/casey/projects/rnessentials/models/cert.js');



  exports.register = function (req, res){
    var {firstName, lastName, email, password, password2} = req.body;
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
        User.findOne({ email :  email } )
          .then((user) => {
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

          })
          .catch((err) => {
            // if there are any errors, return the error
            if (err)
                return done(err);
          })
    }
  }

  module.exports = exports;