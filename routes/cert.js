var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var router = express.Router();
var User = require('../models/user');
var Cert = require('../models/cert');


//Index Page
router.get('/', (req, res) => {
	res.render('./certification/index');
})


//Add cert page
router.get('/add', (req, res) => {
	res.render('./certification/add')
})

//Create cert and save to user
router.post('/', (req, res) => {
	User.findOne({
	    _id: req.user._id
	})
	.then(user => {
		const newCert = {
	    cateogry: req.body.category,
	    title: req.body.title,
	    issued: req.body.issued,
	    expiration: req.body.expiration
	    // file: req.user.file
	  }
	});
	user.certification.unshift(newCert);
	user.save()
		.then(() => {
			res.redirect('/cert/index');
		});
});





module.exports = router;
