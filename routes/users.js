var express = require('express');
var router = express.Router();
var User = require('../models/user');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');






router.get('/dashboard', (req, res) => {
	res.render('./user/dashboard');
})

module.exports = router;
