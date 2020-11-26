var express = require('express');
var router = express.Router();


/* GET success page. */
router.get('/', function(req, res, next) {
   res.render('successPages/successMsgContact', { title: 'Dream Portrait' });
});


module.exports = router;
