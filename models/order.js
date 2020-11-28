var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var products = require('./productOrder').schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    isPayed: {type: Boolean, default: false},
    products: [
        {type: products, ref: 'productOrder'}
    ]
});

module.exports = mongoose.model('Order', schema);