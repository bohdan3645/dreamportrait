var express = require('express');
var router = express.Router();
const mailer = require('../services/mailer')


router.get('/', function (req, res, next) {
    res.render('info/contactUs', {title: 'Dream Portrait', gmailPassword: process.env.GMAIL_PASSWORD, gmailUser: process.env.GMAIL_USER });
});

router.post('/submit', (req, res, next) => {
    const { email, message } = req.body

    mailer.sendContactUsEmail({ email, message })
      .then(_ => res.redirect('/contact-us'))
      .catch(err => {
          console.error(err)
          res.redirect('/contact-us');
      })
});


module.exports = router;

