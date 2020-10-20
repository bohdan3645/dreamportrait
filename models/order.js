var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema =  new Schema ({
	imagePath: {type: String, required: true},
	selectedBakcground: {type: Number, required: true},
	selectedPeople: {type: Number, required: true},
	wishesText: {type: String, required: false},
});


module.exports = mongoose.model('Order', schema);