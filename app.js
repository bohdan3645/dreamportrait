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
const crypto = require('crypto');

// const paypal = require('paypal-rest-sdk');
// const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY); 




const routes = require('./routes/index');
const homePage = require('./routes/homePage');
const orderPage = require('./routes/orderPage');
const cartPage = require('./routes/cartPage');

const userRoutes = require('./routes/user');
var checkout = require('./routes/checkout');
var checkoutPayPal = require('./routes/checkoutPayPal');



const adminPage = require('./routes/adminPage');

const contactUs = require('./routes/contactUs');
const privacyPolicy = require('./routes/privacyPolicy');
const termsOfService = require('./routes/termsOfService');
const refundPolicy = require('./routes/refundPolicy');
const faq = require('./routes/faq');
const reviews = require('./routes/reviews');
const leaveComment = require('./routes/leaveComment');

const successMsgContact = require('./routes/successMsgContact');

var Order = require('./models/order');
var productOrder = require('./models/productOrder');







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
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json({ limit: '50mb' }));
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
// app.use('/checkoutPayPalTest', checkoutPayPal);
app.use('/leaveComment', leaveComment);


app.use('/successMsgContactTest', successMsgContact);




// 1. Create endpoint app.post("/create-order")
app.post("/create-order", (req, res) => {
    // 2. Get secretKey (from .env)
    const secretKey = process.env.SECRET_PAY_KEY;
    const merchantAccount = process.env.MERCHANT_ACCOUNT;
    const merchantDomainName = process.env.MERCHANT_DOMAIN;

    // 3. Read ordered data from request
    const cart = req.body.order;
    const userData = req.body.userData;
    // 4. Concatenate data

    // 5. Call md5 fucntion and pass orderDataText and the key

    // 6. Create order in data base with "isPayed" status "false"

    const order = new Order({
        user: req.user,
        products: req.body.order.map(o => ({
            selectedBakcground: o.backgroundName,
            imagePath: o.image,
            selectedPeople: o.peopleId,
            wishesText: o.text,
            price: o.price
        }))
    });

    order.save(function(err, result) {
        console.log(err);
        if (!err) {
            // console.log(userData.firstName, userData.lastName, userData.email, merchantAccount, merchantDomainName, amount, currency);
            const orderId = result.id;
            const productName = req.body.order.map(o => o.peopleId + o.backgroundName);
            const productCount = req.body.order.map(o => 1);
            const productPrice = req.body.order.map(o => o.price);

            const orderDate = new Date().getTime();
            const currency = 'USD';
            const amount = req.body.order.reduce((acc, o) => acc + o.price, 0);
            const orderDataText = merchantAccount + ';' + merchantDomainName + ';' + orderId + ';' + orderDate + ';' +
                amount + ';' + currency + ';' + productName.join(';') + ';' + productCount.join(';') + ';' + productPrice.join(';');
            console.log(orderDataText);
            var hashData = require("crypto").createHmac("md5", secretKey)
                .update(orderDataText)
                .digest("hex");

            // Read created order id from database

            // Return hash_data and created order id
            res.send({
                orderId: orderId,
                orderDate: orderDate,
                hashData: hashData,
                currency: currency,
                amount: amount,
                merchantDomainName: merchantDomainName,
                merchantAccount: merchantAccount,
                productName: productName,
                productPrice: productPrice,
                productCount: productCount
            });
        } else {
            console.log(err);
            res.status(500);
            res.send(err);
        }
    });
})
//<

app.post('/createOrder', (req, res, next) => {
    try {
        var order = req.body.order;
        order = order.map(o => new Order({
            user: req.user,
            selectedBakcground: o.backgroundName,
            imagePath: o.image,
            selectedPeople: o.peopleId,
            wishesText: o.text,
        }));


        var done = 0;

        for (var h = 0; h < order.length; h++) {

            order[h].save(function(err, result) {
                console.log(err);
                done++;
                if (done === order.length) {}
            });
        }
        res.send();
    } catch (err) {
        console.log(err);
    }

});

// process.on('uncaughtException', function(err) {
// console.log('Caught exception: ' + err);
// });

////////////////////////////////////////////////////////////////////////////////////pal





////////////////////////////////////////////////////////////////////////////////////pal

// Stripe Post


// app.post("/pay", async (req, res, next) => {
//   const { paymentMethodId, paymentIntentId, amount, currency, useStripeSdk } = req.body;

//   try {
//     let intent;
//     if (paymentMethodId) {
//       intent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: currency,
//         payment_method: paymentMethodId,
//         confirmation_method: "manual",
//         confirm: true,
//         use_stripe_sdk: useStripeSdk,
//       });
//     } else if (paymentIntentId) {
//       intent = await stripe.paymentIntents.confirm(paymentIntentId);
//     }
//     res.send(generateResponse(intent));
//   } catch (e) {

//     res.send({ error: e.message });
//     done();
//   }
// });


// const generateResponse = intent => {
//   switch (intent.status) {
//     case "requires_action":
//     case "requires_source_action":
//       return {
//         requiresAction: true,
//         clientSecret: intent.client_secret
//       };
//     case "requires_payment_method":
//     case "requires_source":
//       return {
//         error: "Your card was denied, please provide a new payment method"
//       };
//     case "succeeded":
//       console.log(paymentIntentId);
//       return { clientSecret: intent.client_secret };
//   }
// };
//Stripe Post

//new Comment

//new Comment


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