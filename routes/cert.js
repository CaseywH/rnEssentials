var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = mongoose.model('user');
const Cert = mongoose.model('cert');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


//Index Page
router.get('/', ensureAuthenticated, (req, res) => {
	res.render('./certification/index');
})


//Add cert page
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('./certification/add')
})

//Create cert and save to user
router.post('/', ensureAuthenticated, (req, res) => {
	User.findOne({
	    _id: req.user.id
	})
	.then(user => {
		const newCert = {
	    cateogry: req.body.category,
	    title: req.body.title,
	    issued: req.body.issued,
	    expiration: req.body.expiration,
			notes: req.body.notes
	    // file: req.user.file
	  }
		console.log(newCert);
		user.certifications.unshift(newCert);
		user.save()
		.then(() => {
			res.redirect('/cert/index');
		});
	})

});





module.exports = router;
