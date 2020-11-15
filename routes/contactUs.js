var express = require('express');
var router = express.Router();
 const nodemailer = require('nodemailer');




router.get('/', function(req, res, next) {
   res.render('info/contactUs', { title: 'shopp' });
});

router.post('/submit', (req, res, next) => {
	var fname = req.body.contactFname;
	var lname = req.body.contactLname;
	var email = req.body.contactEmail;
	var message = req.body.contactMessage;



  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dreamportraitstore@gmail.com',
    pass: '34yiuOH87%$#'
  }
});

let mailOption = {
  from: email,
  to: 'dreamportraitstore@gmail.com',
  subject: 'Dream Portrait Support',
  text: 'hello'
}

transporter.sendMail(mailOption, (err, data) => {
if(!message){
  res.redirect('/contactUsTest');
}else{
 res.redirect('/successMsgContactTest');
}
});
});




module.exports = router;

