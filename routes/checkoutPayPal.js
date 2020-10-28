var express = require('express');
var router = express.Router();


/* GET checkout Pay Pal page. */
router.get('/', function(req, res, next) {
   res.render('shop/checkoutPayPal', { title: 'shopp' });
});

module.exports = router;
