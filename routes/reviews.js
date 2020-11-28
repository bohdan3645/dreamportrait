var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
var Comment = require('../models/comment');
var Order = require('../models/order');
var ObjectId = require('mongodb').ObjectID;

//TODO: Remove the duplication.
const isAdmin = (roles, user) => {
    if (!user) {
        return false;
    }

    return !!roles.find(role => user.role === role);
};

/* GET reviews page. */
router.get('/', function (req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            console.log(err);
            //TODO: Add error page.
            res.send();
        } else {
            const products = orders.reduce((acc, o) => acc.concat(o.products), [])
                .filter(p => p.comment)
                .map(p => ({
                    imagePath: p.imagePath,
                    comment: {
                        comment: p.comment.comment,
                        ratig: p.comment.rating
                    }
                }));

            res.render('shop/reviews', {
                title: 'Dream Portrait',
                products: products.filter(product => product.comment.isVisible),
                isAdmin: isAdmin(["admin"], req.user)
            });
        }
    });
});

router.put('/hide', (req, res) => {
    const productId = req.body.productId;

    Order.update({'products._id': ObjectId(productId)}, {
        "$set": {
            "products.$.comment.isVisible": false
        }
    }, function (err, order) {
        if (err) {
            res.send(err);
        } else {
            res.send(order);
        }
    });
});

router.post('/submit', (req, res, next) => {
    var comment = req.body.comment;
    var id = req.body.id;
    var rating = 5;

    Order.update({'products._id': ObjectId(id)}, {
        "$set": {
            "products.$.comment": new Comment({
                comment: comment,
                rating: rating
            })
        }
    }, function (err, order) {
        if (err) {
            res.send(err);
        } else {
            res.send(order);
        }
    });
})

module.exports = router;