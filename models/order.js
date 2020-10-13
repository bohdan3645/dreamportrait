var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema =  new Schema ({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object, required: true},
	paymentId: {type: String, required: true}
	// imagePath: {type: String, required: true},
	// peopleQnt: {type: Number, required: true},
	// background: {type: String, required: true},
	// description: {type: String, required: false},
	// price: {type: Number, required: true}
});


module.exports = mongoose.model('Order', schema);