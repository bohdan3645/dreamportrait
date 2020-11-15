var express = require('express');
var router = express.Router();


/* GET artIsDone page. */
router.get('/', function(req, res, next) {
   res.render('successPages/artIsDone', { title: 'shopp' });
});

module.exports = router;
