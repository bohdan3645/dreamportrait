var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@' + process.env.MONGOCLASTER + '?retryWrites=true&w=majority');
var Comment = require('../models/comment');
var Order = require('../models/order');
var ObjectId = require('mongodb').ObjectID;

const Review = require('../models/review');

//TODO: Remove the duplication.
const isAdmin = (roles, user) => {
    if (!user) {
        return false;
    }

    return !!roles.find(role => user.role === role);
};

/* GET reviews page. */
router.get('/', async function (req, res, next) {
    const reviews = (await Review.find().sort({ createdAt: -1 })).map(r => r.toJSON())

    Order.find({}, function (err, orders) {
        if (err) {
            console.log(err);
            //TODO: Add error page.
            res.send();
        } else {
            const products = orders.reduce((acc, o) => acc.concat(o.products), [])
                .filter(p => p.comment.isVisible)
                .map(p => {
                    const ratingList = [];

                    for (let i = 0; i < 5; i++) {
                        ratingList.push(i < p.comment.rating);
                    }
                    return {
                        imagePath: p.imagePath,
                        artImage: p.artImage,
                        id: p._id,
                        comment: {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            comment: p.comment.comment,
                            isVisible: p.comment.isVisible,
                            rating: ratingList
                        }
                    }
                });

            res.render('shop/reviews', {
                title: 'Dream Portrait',
                products: products.filter(product => product.comment.isVisible),
                reviews
            });
        }
    });
});

router.post('/hide', (req, res) => {
    //TODO: Add admin validation
    const productId = req.body.productId;

    Order.update({'products._id': ObjectId(productId)}, {
        "$set": {
            "products.$.comment.isVisible": false
        }
    }, function (err, order) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/reviews-page')
        }
    });
});

router.post('/submit', (req, res, next) => {
    const comment = req.body.comment;
    const id = req.body.id;
    const rating = Number(req.body.rating) || 5;

    Order.update({'products._id': ObjectId(id)}, {
        "$set": {
            "products.$.comment": new Comment({
                comment: comment,
                isVisible: true,
                rating: rating
            })
        }
    }, function (err, order) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
})

module.exports = router;
