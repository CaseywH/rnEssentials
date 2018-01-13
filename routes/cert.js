var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = mongoose.model('user');
const Cert = mongoose.model('cert');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const keys = require('../config/keys');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: keys.CLOUD_NAME,
  api_key: keys.api_key,
  api_secret: keys.api_secret
});


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
router.post("/", ensureAuthenticated, upload.single('image'), function(req, res) {
	User.findOne({
	    _id: req.user.id
	})
	.then(user => {
		cloudinary.uploader.upload(req.file.path, function(result) {
				const newCert = {
			    cateogry: req.body.category,
			    title: req.body.title,
			    issued: req.body.issued,
			    expiration: req.body.expiration,
				notes: req.body.notes,
			    image: result.secure_url
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
	               req.flash('success_msg', 'Created a cert/license!');
	               res.redirect('/cert');
	           }
			});
		});
	});
});


//edit Cer form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Cert.findOne({
		_id: req.params.id
	})
	.then(cert => {
		res.render('certification/edit', {cert: cert})
	})
});

//Edit Cert Process
router.put('/:id', (req, res) => {
	Cert.findOne({
		_id: req.params.id
	})
	.then(cert => {
	// New values
	cert.cateogry = req.body.category
	cert.title = req.body.title,
	cert.issued = req.body.issued,
	cert.expiration = req.body.expiration,
	cert.notes = req.body.notes

	cert.save()
		.then(cert => {
			res.redirect('/cert');
		})
	})
})


//Delete Cert
router.delete('/:id', (req, res) => {
	Cert.remove({_id:req.params.id})
	.then(() => {
		req.flash('success_msg', 'cert/license!');
		res.redirect('/cert')
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
