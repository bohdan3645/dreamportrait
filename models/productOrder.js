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
	email: { type: Schema.Types.String },
	formatType: { type: Schema.Types.String },
	userData: {
		firstName: Schema.Types.String,
		lastName: Schema.Types.String,
		phone: Schema.Types.String,
		address1: Schema.Types.String,
		address2: Schema.Types.String,
		city: Schema.Types.String,
		postcode: Schema.Types.String,
		country: Schema.Types.String,
		state: Schema.Types.String,
	},
});


module.exports = mongoose.model('productOrder', schema);
