const express = require('express');
const router = express.Router();

//order
const Order = require('../models/order');

router.get('/', function(req, res, next) {
 Order.find(function(err, docs) {
   res.render('shop/homePage', { title: 'shopp', orders: docs });
  });	
});
//order

router.get('/cartPageTest/:id', function(req, res, next) {
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
