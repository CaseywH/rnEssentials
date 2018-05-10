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

var helper = require('./helpers/cert')

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
	helper.displayCerts(req, res)
})


//Add cert page
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('./certification/add')
})

//Create cert and save to user
router.post("/", ensureAuthenticated, upload.single('image'), function(req, res) {
	helper.createCert(req, res)
});


//edit Cert form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	helper.editCertForm(req, res)
});

//Edit Cert Process
router.put('/:id', (req, res) => {
	helper.editCert(req, res)
})


//Delete Cert
router.delete('/:id', (req, res) => {
	helper.deleteCert(req, res)
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
