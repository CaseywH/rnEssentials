var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


var User = require('../models/user');
var Cert = require('../models/cert');
var helper = require('./helpers/auth')

// Register
router.get('/register', (req, res) => {
	res.render('./index/register');
});

// Local Login
router.get('/login', (req, res) => {
	res.render('./index/login');
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/dashboard', failureRedirect:'/auth/login',failureFlash: true}),
  (req, res) => {
  	req.flash('success_msg', 'You are logged in');
    res.redirect('/cert');
  });

// Register User
router.post('/register', (req, res) => {
	helper.register(req, res);
});

//google login
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

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
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }), (req, res) => {
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
