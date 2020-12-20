var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productOrder = require('./productOrder').schema;

var schema =  new Schema ({
	firstName: { type: String, default: true },
	lastName: { type: String, default: true },
	isVisible: { type: Boolean, default: false },
	url: { type: String, default: '' },
	comment: { type: String, default: '' },
	rating: { type: Number, required: false }
});

module.exports = mongoose.model('Comment', schema);