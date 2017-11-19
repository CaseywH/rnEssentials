var mongoose = require('mongoose');
const Schema = mongoose.Schema
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
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
	certification:[
		{
	      type: Schema.Types.ObjectId,
	      ref:'Cert'
	    }
	]
});

var User = module.exports = mongoose.model('User', UserSchema);

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
