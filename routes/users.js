var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cert = require('../models/cert');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');






router.get('/dashboard', (req, res) => {
	res.render('./user/dashboard');
})

module.exports = router;
