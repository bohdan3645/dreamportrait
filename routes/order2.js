var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('shop/order2', { title: 'shopp' });
});

module.exports = router;
