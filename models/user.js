var mongoose = require('mongoose');
const Schema = mongoose.Schema
var bcrypt = require('bcryptjs');
var Cert = require('../models/cert');

// User Schema
var UserSchema = mongoose.Schema({
	facebookID:{
		type: String
	},
	facebookToken:{
		type: String
	},
	googleID:{
		type: String,
		required: false
	},
	password: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	certifications: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "cert"
      }
   ]
});

module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
