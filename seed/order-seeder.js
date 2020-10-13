var Order = require('../models/order');
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');


var orders = [
	new Order ({
		user:,
		cart:,
		paymentId:
}),
];

var done = 0;

for (var h = 0; h < orders.length; h++) {
	orders[h].save(function (err, result) {
		console.log(err, result);
		done++;
		if(done === orders.length) {
			exit();
		}
	});
}

function exit() {
	 mongoose.disconnect();
}