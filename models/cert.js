var mongoose = require('mongoose');
const Schema = mongoose.Schema


// User Schema
var CertSchema = mongoose.Schema({
	cateogry:{
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	issued: {
		type: Date,
		required: false
	},
	expiration: {
		type: Date,
		required: false
	},
	notes: {
		type: String,
		required: false
	},
	image: {
		type: String,
		required: false
	}
});

var User = module.exports = mongoose.model('Cert', CertSchema);
