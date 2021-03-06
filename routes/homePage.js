var express = require('express');
var router = express.Router();
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
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
                      comment: p.comment.comment,
                      isVisible: p.comment.isVisible,
                      rating: ratingList
                   }
                }
             });

         res.render('shop/homePage', {
            title: 'Dream Portrait',
            products: products.filter(product => product.comment.isVisible),
            // isAdmin: isAdmin(["admin"], req.user)
         });
      }
   })
});




module.exports = router;
