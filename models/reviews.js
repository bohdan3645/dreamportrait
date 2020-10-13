var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rewievsSchema =  new Schema ({
    user: {type: String, required: true},
    comment: {type: String, required: true}
});


module.exports = mongoose.model('Reviews', schema);