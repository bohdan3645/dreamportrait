var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productOrder = require('./productOrder').schema;

var schema =  new Schema ({
	comment: { type: String, required: true },
	rating: { type: Number, required: true }
});

module.exports = mongoose.model('Comment', schema);