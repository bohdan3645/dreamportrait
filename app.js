  var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require('nodemailer');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRoutes = require('./routes/user');
var orderPage = require('./routes/orderPage');
var contactUs = require('./routes/contactUs');
var privacyPolicy = require('./routes/privacyPolicy');
var termsOfService = require('./routes/termsOfService');
var refundPolicy = require('./routes/refundPolicy');
var faq = require('./routes/faq');
var homePage = require('./routes/homePage');
var cartPage = require('./routes/cartPage');

var order2 = require('./routes/order2');

var doOrders = require('./routes/doOrders');



var app = express();

mongoose.connect('mongodb+srv://kafka1010:kakao300@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'mysupersecret', 
	resave: false, 
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie:{ maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session =req.session;
	next();
});

app.use('/user', userRoutes);
app.use('/orderPageTest', orderPage);
app.use('/contactUsTest', contactUs);
app.use('/privacyPolicyTest', privacyPolicy);
app.use('/termsOfServiceTest', termsOfService);
app.use('/privacyPolicyTest', privacyPolicy);
app.use('/refundPolicyTest', refundPolicy);
app.use('/F.A.Q.Test', faq);
app.use('/homePageTest', homePage);
app.use('/cartPageTest', cartPage);

app.use('/order2Test', order2);

app.post('/doOrdersTest', function(req, res) {
	
let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '1117c414d43f0e',
       pass: 'e24eebc8afcb27'
    }
});
var mailOptions = {
  from: 'pavliuk.vlad@gmail.com',
  to: 'ehohorb@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was not shit easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
	res.json({test: 'jakob'});
});







app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
