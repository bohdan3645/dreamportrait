var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Settings = require('../models/settings');
var Review = require('../models/review');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const settings = await Settings.getSettings()
    const reviews = (await Review.find().sort({ createdAt: -1 })).map(r => r.toJSON())

    Order.find({}, function (err, orders) {
        if (err) {
            console.log(err);
            //TODO: Add error page.
            res.send();
        } else {
            const products = orders.reduce((acc, o) => acc.concat(o.products), [])
                .filter(p => p.comment.isVisible);

            let reviewsAmount = products.filter(product => product.comment).length;
            let averageRating = products.reduce((acc, product) => acc + product.comment.rating, 0) / products.length;
            const ratingList = [];
            averageRating = averageRating || 5;

            for (let i = 0; i < 5; i++) {
                ratingList.push(i < averageRating);
            }

            res.render('shop/orderPage', {
                title: 'Dream Portrait',
                products: products.filter(product => product.comment.isVisible),
                hasReviews: reviewsAmount > 0,
                reviewsAmount: reviewsAmount,
                averageRating: ratingList,
                spots: settings.spots,
                reviews
            });
        }
    })
});

module.exports = router;
