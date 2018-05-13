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
router.get('/', ensureAuthenticated, helper.displayCerts)


//Add cert page
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('./certification/add')
})

//Create cert and save to user
router.post("/", ensureAuthenticated, upload.single('image'), helper.createCert)

//edit Cert form
router.get('/edit/:id', ensureAuthenticated,helper.editCertForm)

//Edit Cert Process
router.put('/:id', helper.editCert)


//Delete Cert
router.delete('/:id', helper.deleteCert)







module.exports = router;
