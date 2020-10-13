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
    user: 'ehohorb@gmail.com',
    pass: 'eLkamino1010'
  }
});

let mailOption = {
  from: email,
  to: email,
  subject: 'hello',
  text: message
}

transporter.sendMail(mailOption, (err, data) => {
if(err){
  console.log("error send!");
}else{
  console.log('saccess send!');
}
});

res.end('all good');
});




module.exports = router;

