var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productOrder = require('./productOrder').schema;

var schema =  new Schema ({
	isVisible: { type: Boolean, default: false },
	url: { type: String, default: '' },
	comment: { type: String, default: '' },
	rating: { type: Number, required: false }
});

module.exports = mongoose.model('Comment', schema);