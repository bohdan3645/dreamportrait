var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema =  new Schema ({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	nameComment: {type: String, required: true},
	emailComment: {type: String, required: true},
	comment: {type: String, required: true},
});


module.exports = mongoose.model('Comment', schema);