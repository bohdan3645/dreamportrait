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
var checkout = require('./routes/checkout');


const adminPage = require('./routes/adminPage');

const contactUs = require('./routes/contactUs');
const privacyPolicy = require('./routes/privacyPolicy');
const termsOfService = require('./routes/termsOfService');
const refundPolicy = require('./routes/refundPolicy');
const faq = require('./routes/faq');
const reviews = require('./routes/reviews');
const successMsgContact = require('./routes/successMsgContact');

var Order = require('./models/order');




const app = express();



// mongodb
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dream:portrait@cluster0.jnslv.mongodb.net/dream-portrait?retryWrites=true&w=majority');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
require('./config/passport');
// mongodb


// view engine hbs setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');
// view engine hbs setup

app.use(logger('dev'));
app.use(express.urlencoded({limit: '50mb', extended: false }));
app.use(express.json({limit: '50mb'}));
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
app.use('/reviewsTest', reviews);
app.use('/checkoutTest', checkout);
app.use('/successMsgContactTest', successMsgContact);




app.post('/createOrder', (req, res, next) => {
  
var order = req.body.order;
order = order.map(o => new Order({
    user: req.user,
    imagePath: o.image,
    selectedBakcground: o.backgroundName,
    selectedPeople: o.peopleId,
    wishesText: o.text,
  }));

var done = 0;

console.log(order);

for (var h = 0; h < order.length; h++) {

  order[h].save(function (err, result) {
    console.log(err);
    done++;
    if(done === order.length) {
      mongoose.disconnect();
    }
  });
}

res.status(200);
res.end();
});


// Stripe Post


app.post("/pay", async (req, res, next) => {
  const { paymentMethodId, paymentIntentId, amount, currency, useStripeSdk } = req.body;

  try {
    let intent;
    if (paymentMethodId) {
      intent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: true,
        use_stripe_sdk: useStripeSdk,
      });
    } else if (paymentIntentId) {
      intent = await stripe.paymentIntents.confirm(paymentIntentId);
    }
    res.send(generateResponse(intent));
  } catch (e) {
    
    res.send({ error: e.message });
    done();
  }
});


const generateResponse = intent => {
  switch (intent.status) {
    case "requires_action":
    case "requires_source_action":
      return {
        requiresAction: true,
        clientSecret: intent.client_secret
      };
    case "requires_payment_method":
    case "requires_source":
      return {
        error: "Your card was denied, please provide a new payment method"
      };
    case "succeeded":
      console.log(paymentIntentId);
      return { clientSecret: intent.client_secret };
  }
};
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