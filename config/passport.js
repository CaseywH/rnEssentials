const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

var User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
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
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));


  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      }
      //Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          done(null, user);
        } else {
          // create user
          new User(newUser)
            .save()
            .then(user => done(null, user))
        }
      })
    })
  );

passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: keys.callbackURL,
    profileFields: ['id', 'emails', 'name']
  },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(() =>{
        User.findOne({'facebookID': profile.id}, (err, user) =>{
          if(err)
            return done(err);
          if(user){
            return done(null, user);
          }else{
            var newUser = {
            facebookID: profile.id,
            facebookToken: accessToken,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
            }

          new User(newUser)
          .save()
          .then(user => done(null, user))
          console.log(user)
        }
      });
    });
}));




  exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  /**
   * Authorization Required middleware.
   */
  exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find(token => token.kind === provider);
    if (token) {
      next();
    } else {
      res.redirect(`/auth/${provider}`);
    }
  };
