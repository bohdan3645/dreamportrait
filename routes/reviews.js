var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
var Comment = require('../models/comment');
var Order = require('../models/order');
var ObjectId = require('mongodb').ObjectID;

/* GET reviews page. */
router.get('/', function(req, res, next) {
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

            res.render('shop/reviews', { title: 'shopp', products: products});        
        }
    });
});

router.post('/submit', (req, res, next) => {
    var comment = req.body.comment;
    var id = req.body.id;
    var rating = 5;

    Order.update({ 'products._id': ObjectId(id) }, { 
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