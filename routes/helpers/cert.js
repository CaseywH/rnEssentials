var User = require('/Users/casey/projects/rnessentials/models/user.js');
var Cert = require('/Users/casey/projects/rnessentials/models/cert.js');

module.exports = {
  displayCerts: function(req, res){
    User.findOne({_id: req.user.id})
    .populate('certifications')
    .then(user => {
      res.render('./certification/index', {certObj:sortCert(user.certifications)});
    })
  },
  createCert: function(req, res){
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
        Cert.create(newCert)
          .then((cert)=> {
            cert.save();
            user.certifications.push(cert);
            user.save();
            console.log(cert);
            req.flash('success_msg', 'Created a cert/license!');
            res.redirect('/cert');
          })
          .catch((err)=> {
            console.log(err);
          })
        });
		  });
  },
  editCertForm: function(req, res){
    Cert.findOne({
      _id: req.params.id
    })
    .then(cert => {
      res.render('certification/edit', {cert: cert})
    })
  },
  editCert: function(req, res){
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
  },
  deleteCert: function(req, res){
    Cert.remove({_id:req.params.id})
	  .then(() => {
		req.flash('success_msg', 'cert/license!');
		res.redirect('/cert')
	  })
  }
}