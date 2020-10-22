var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema =  new Schema ({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	imagePath: {type: String, required: true},
	selectedBakcground: {type: String, required: true},
	selectedPeople: {type: Number, required: true},
	wishesText: {type: String, required: false},
	// price: {type: Number, required: true}
});


module.exports = mongoose.model('Order', schema);