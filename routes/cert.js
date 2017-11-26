var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = mongoose.model('user');
const Cert = mongoose.model('cert');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


//Index Page
router.get('/', ensureAuthenticated, (req, res) => {
	User.findOne({_id: req.user.id})
	.populate('certifications')
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
		Cert.create(newCert, function(err, cert){
			if(err){
               console.log(err);
           } else {
               //save comment
               cert.save();
               user.certifications.push(cert);
               user.save();
               console.log(cert);
               req.flash('success', 'Created a cert/license!');
               res.redirect('/cert');
           }
		});
	});
});

//Delete Cert
router.delete('/:id', (req, res) => {
	Cert.remove({_id:req.params.id})
	.then(() => {
		res.redirect('/dashboard')
	})
})

//sort certifications
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
		}else if (cert.cateogry == "Miscellaneous") {
			certObj.miscellaneous.push(cert)
		}
	});
	return certObj;
}




module.exports = router;
