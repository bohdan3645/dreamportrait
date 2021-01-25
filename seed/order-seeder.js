var Order = require('../models/order');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');


var orders = [
	new Order ({

		imagePath: image,
		selectedBakcground: selectedBakcground,
		selectedPeople: item.selectedPeople.price,
		wishesText: wishesText,
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
