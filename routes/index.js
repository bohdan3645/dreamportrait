const express = require('express');
const router = express.Router();

//order
const Order = require('../models/order');
const Review = require('../models/review');

router.get('/', async (req, res, next) => {
	const reviews = (await Review.find().sort({ createdAt: -1 })).map(r => r.toJSON())

 Order.find(function(err, docs) {
   res.render('shop/homePage', {
   	 title: 'Dream Portrait',
		 orders: docs,
		 reviewsCount: reviews.length,
		 reviews
   });
  });
});
//order
router.get('/cart-page/:id', function(req, res, next) {
	var orderId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Order.findById(orderId, function(err, order) {
		if (err) {
			return res.redirect('/');
		}
		cart.add(order, order.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		req.redirect('/');
	});
});

module.exports = router;
