require('dotenv').config();

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express')
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);





const routes = require('./routes/index');
const homePage = require('./routes/homePage');
const orderPage = require('./routes/orderPage');
const cartPage = require('./routes/cartPage');

const userRoutes = require('./routes/user');

const adminPage = require('./routes/adminPage');

const contactUs = require('./routes/contactUs');
const privacyPolicy = require('./routes/privacyPolicy');
const termsOfService = require('./routes/termsOfService');
const refundPolicy = require('./routes/refundPolicy');
const faq = require('./routes/faq');


const app = express();



// mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
require('./config/passport');
// mongodb


// view engine hbs setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');
// view engine hbs setup


app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});


app.use('/user', userRoutes);
app.use('/', routes);

app.use('/orderPageTest', orderPage);
app.use('/contactUsTest', contactUs);
app.use('/adminPageTest', adminPage);
app.use('/termsOfServiceTest', termsOfService);
app.use('/privacyPolicyTest', privacyPolicy);
app.use('/refundPolicyTest', refundPolicy);
app.use('/F.A.Q.Test', faq);
app.use('/homePageTest', homePage);
app.use('/cartPageTest', cartPage);




// Stripe Post
app.post('/stripePaymant', (req, res, next)=> {
  const {order, token} = req.body;
  console.log('ORDER ', order);

  return stripe.customers
  .create({
    email: req.body.email,
    source: "tok_visa"
 })
  .then(customer => {
   return stripe.charges.create(
    {
      amount:  req.body.price,
      currency: 'usd',
      customer: customer.id,
      receipt_email: req.body.email,
      description: 'order',
    });
  })
  .then(result => res.status(200).json(result))
  .catch(err => console.log(err));

});


//Stripe Post

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