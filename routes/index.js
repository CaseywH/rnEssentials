var express = require('express');
var router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Get Homepage
router.get('/', function(req, res){
	res.render('welcome');
});


module.exports = router;
