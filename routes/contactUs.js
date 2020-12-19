var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');


router.get('/', function (req, res, next) {
    res.render('info/contactUs', {title: 'Dream Portrait', gmailPassword: process.env.GMAIL_PASSWORD, gmailUser: process.env.GMAIL_USER });
});

router.post('/submit', (req, res, next) => {
    var fname = req.body.contactFname;
    var lname = req.body.contactLname;
    var email = req.body.contactEmail;
    var message = req.body.contactMessage;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPassword
        }
    });

    let mailOption = {
        from: email,
        to: 'dreamportraitstore@gmail.com',
        subject: 'Dream Portrait Support',
        text: 'hello'
    }

    transporter.sendMail(mailOption, (err, data) => {
        if (!message) {
            res.redirect('/contact-us');
        } else {
            res.redirect('/success-msg-contact');
        }
    });
});


module.exports = router;

