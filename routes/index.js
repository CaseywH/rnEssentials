var express = require('express');
var router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Get Homepage
router.get('/', (req, res) => {
	res.render('welcome');
});

router.get('/about', (req, res) =>{
	res.render('./index/about');
});

module.exports = router;
