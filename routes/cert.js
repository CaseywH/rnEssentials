var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = mongoose.model('user');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


//Index Page
router.get('/', ensureAuthenticated, (req, res) => {
	User.findOne({_id: req.user.id})
	.then(user => {
		res.render('./certification/index', {certObj:sortCert(user.certifications)});
	})
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
		  };
		user.certifications.push(newCert);
		user.save()
			.then(() => {
				res.redirect('/cert');
			});
	});
});

const sortCert = function(certs) {
	const certObj = {
		license: [],
		required: [],
		specialty: [],
		facility: [],
		miscellaneous: []
	}
	certs.forEach(cert => {
		if(cert.cateogry == "Liscense"){
			certObj.license.push(cert)
		}else if (cert.cateogry == "Required Certifications") {
			certObj.required.push(cert)
		}else if (cert.cateogry == "Specialty Certifications") {
			certObj.specialty.push(cert)
		}else if (cert.cateogry == "Facility Specific") {
			certObj.facility.push(cert)
		}else if (cert.cateogry == "miscellaneous") {
			certObj.miscellabeous.push(cert)
		}
	});
	return certObj;
}




module.exports = router;
