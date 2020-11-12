var express = require('express');
var router = express.Router();

const checkIsInRole = (...roles) => (req, res, next) => {
	console.log(req.user)
  if (!req.user) {
    return res.redirect('/user/signin')
  }

  const hasRole = roles.find(role => req.user.role === role)
  if (!hasRole) {
    return res.redirect('/user/signin')
  }

  return next()
}

/* GET admin page. */
router.get('/', checkIsInRole("admin"), function(req, res, next) {
   res.render('admin/adminPage', { title: 'shopp' });
});

module.exports = router;