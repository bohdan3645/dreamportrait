var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = require('./comment');

var schema =  new Schema ({
	imageUrl: { type: Schema.Types.String, required: true },
	artImage: {type: String, default: null},
	artImageCreatedAt: {type: String, default: null},
	// TODO: Rename this shit later
	selectedBakcground: {type: String, required: true},
	selectedPeople: {type: Number, required: true},
	wishesText: {type: String, required: false},
	price: {type: Number, required: true},
	comment: {type: Comment.schema, ref: 'comment', default: null},
	email: { type: Schema.Types.String }
});


module.exports = mongoose.model('productOrder', schema);
