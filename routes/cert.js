var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cert = require('../models/cert');



router.get('/index', (req, res) => {
	res.render('./certification/index');
})

module.exports = router;
