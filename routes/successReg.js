var express = require('express');
var router = express.Router();


/* GET successReg page. */
router.get('/', function(req, res, next) {
   res.render('successPages/successReg', { title: 'shopp' });
});

module.exports = router;
