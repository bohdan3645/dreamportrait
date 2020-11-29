var express = require('express');
var router = express.Router();
var Order = require('../models/order');

/* GET home page. */
router.get('/:reviewLink', function (req, res, next) {
    const link = req.protocol + "://" + req.headers.host + req.baseUrl + req.url;

    Order.findOne({'products.comment.url': link}, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            if (!order) {
                res.redirect('/');

                return;
            }
            const product = order.products.find(p => p.comment.url === link);

            if (product.artImage) {
                res.render('shop/reviewForm', {productId: product._id.toString()})
            } else {
                res.render('shop/reviewNoArt');
            }
        }
    });
});

module.exports = router;
