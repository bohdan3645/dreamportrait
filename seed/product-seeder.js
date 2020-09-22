var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kafka1010:kakao300@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');


var products = [ 
 new Product({
 	imagePath:'https://i.pinimg.com/originals/d3/02/e4/d302e4d06d9afae957b686985215270a.jpg',
 	title: 'Some picture',
 	description: 'Awesome picture'
}),
 new Product({
 	imagePath:'https://i.pinimg.com/originals/d3/02/e4/d302e4d06d9afae957b686985215270a.jpg',
 	title: "	Some picture",
 	description: 'Awesome picture'
}),
 new Product({
 	imagePath:'https://i.pinimg.com/originals/d3/02/e4/d302e4d06d9afae957b686985215270a.jpg',
 	title: 'Some picture',
 	description: 'Awesome picture'
})
];

var done = 0;

for (var i = 0; i < products.length; i++) {
	products[i].save(function(err, result) {
		done++;
		if(done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}

