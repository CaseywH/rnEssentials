var express = require('express');
var router = express.Router();


var User = require('../models/user');



router.get('/dashboard', (req, res) => {
	res.render('./user/dashboard');
})

module.exports = router;