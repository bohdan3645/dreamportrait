var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('shop/checkout', { title: 'shopp', stripe: process.env.PUBLISHABLE_STRIPE_KEY });
});

module.exports = router;
