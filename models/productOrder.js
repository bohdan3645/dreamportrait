var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comment = require('./comment').schema;

var schema =  new Schema ({
	imagePath: {type: String, required: true},
	imageMiniPath: {type: String, required: true},
	artImage: {type: String, default: null},
	artImageCreatedAt: {type: String, default: null}, 
	selectedBakcground: {type: String, required: true},
	selectedPeople: {type: Number, required: true},
	wishesText: {type: String, required: false},
	price: {type: Number, required: true},
	comment: {type: comment, ref: 'comment', default: null}

});


module.exports = mongoose.model('productOrder', schema);