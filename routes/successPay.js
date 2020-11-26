var express = require('express');
var router = express.Router();


/* GET successPay page. */
router.get('/', function(req, res, next) {
   res.render('successPages/successPay', { title: 'Dream Portrait' });
});

module.exports = router;
