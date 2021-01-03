const express = require('express');
const router = express.Router();
const passport = require('passport');
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var crypto = require("crypto");
var Order = require('../models/order');
var User = require('../models/user');

const csrfProtection = csrf();
router.use(csrfProtection);

const isAdmin = (roles, user) => {
    if (!user) {
        return false;
    }

    return !!roles.find(role => user.role === role);
};

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            //TODO: bullshit
            return res.write('Error!');
        }
        res.render('user/profile', {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            orders: orders.reduce((acc, o) => acc.concat(o.products), [])
                .map(p => {
                    const createAt = new Date(p.artImageCreatedAt);
                    return {
                        id: p._id,
                        imagePath: p.imagePath,
                        imageMiniPath: p.imageMiniPath,
                        artImage: p.artImage,
                        artImageCreatedAt: createAt.getDate().toString() + "." + createAt.getMonth().toString() + "." + createAt.getFullYear().toString(),
                        selectedPeople: p.selectedPeople,
                        selectedBakcground: p.selectedBakcground,
                        wishesText: p.wishesText,
                        price: p.price,
                    }
                })
        });
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

/* GET user/register page. */
router.get('/register', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/forgot-password', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/forgotPassword', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/update-password', function (req, res, next) {
    res.render('user/updatePassword', {resetLink: null});
});

router.get('/update-password/:resetLink', function (req, res, next) {
    const link = req.protocol + "://" + req.headers.host + req.baseUrl + req.url;

    User.findOne({'resetLink': link}, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else if (!user) {
            console.log("link not found");
            res.redirect('/');
        } else {
            res.render('user/updatePassword', {resetLink: link, csrfToken: req.csrfToken()});
        }
    });

    //TODO: Add Wrong reset link page
    console.log('wrong link');
    //res.render('user/successResetPassword');
});

router.post('/update-password', function (req, res, next) {
    User.findOneAndUpdate({'resetLink': req.body.reset_link}, {
        "$set": {
            'password': new User().encryptPassword(req.body.password),
            'resetLink': null
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            // send email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            });

            let mailOption = {
                from: process.env.GMAIL_USER,
                // TODO: fix email sending
                to: user.email,
                subject: 'Dream Portrait Support',
                text: 'Your password has been changed'
            }

            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/user/signin');
            });
        }
    });
});

router.post('/forgot-password', function (req, res, next) {
    // user new reset password link to the user

    User.findOne({'email': req.body.email}, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (!user) {
                req.flash('error', ['Email does not exist']);
                res.redirect('/user/forgot-password');
            }

            const baseLink = req.protocol + "://" + req.headers.host + '/user/update-password/';
            const resetLink = crypto.randomBytes(50).toString('hex');

            User.update({'email': req.body.email}, {
                "$set": {
                    "resetLink": baseLink + resetLink
                }
            }, function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    // send email
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_PASSWORD
                        }
                    });

                    let mailOption = {
                        from: process.env.GMAIL_USER,
                        to: req.body.email,
                        subject: 'Dream Portrait Support',
                        text: 'Reset password link: \n' + baseLink + resetLink
                    }

                    transporter.sendMail(mailOption, (err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/user/success-reset-password');
                    });
                }
            });
        }
    });
});

router.get('/success-reset-password', function (req, res, next) {
    res.render('user/successResetPassword');
});

router.post('/register', passport.authenticate('local.register', {
    failureRedirect: '/user/register',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/order-page');
    }
});


/* GET user/signin page. */
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    // store previous page url
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
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
    res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
