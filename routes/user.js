var express = require('express');
var router = express.Router();
var passport  = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn,function(req, res, next) {
	res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.use('/', notLoggedIn,function(req, res, next) {
	next();
});

/* GET user/register page. */
router.get('/register', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/register', passport.authenticate('local.register', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/register',
	failureFlash: true
}));


/* GET user/sigin page. */
router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));


/* GET user/profile page. */


module.exports = router;


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}