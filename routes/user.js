const express = require('express');
const router = express.Router();
const passport = require('passport');
const csrf = require('csurf');
const nodemailer = require('nodemailer');

var Order = require('../models/order');

const csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, function(req, res, next) {
    Order.find({ user: req.user }, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        res.render('user/profile', { 
            orders: orders.reduce((acc, o) => acc.concat(o.products), []) 
                .map(p => ({
                    id: p._id,
                    imagePath: p.imagePath,
                    artImage: p.artImage,
                    selectedPeople: p.selectedPeople,
                    selectedBakcground: p.selectedBakcground,
                    wishesText: p.wishesText,
                    price: p.price,
                }))
        });
    });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

/* GET user/register page. */
router.get('/register', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/register', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/register', passport.authenticate('local.register', {
    failureRedirect: '/user/register',
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
    	var oldUrl = req.session.oldUrl;
    	req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
    

});


/* GET user/signin page. */
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
    	req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});





/* GET user/profile page. */


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}