var mongoose = require('mongoose');
const Schema = mongoose.Schema


// User Schema
var CertSchema = mongoose.Schema({
	cateogry:{
		type: String
	},
	title: {
		type: String
	},
	issued: {
		type: Date
	},
	expiration: {
		type: Date
	},
	notes: {
		type: String
	},
	image: {
		type: String
	}
});

module.exports = mongoose.model('cert', CertSchema);
