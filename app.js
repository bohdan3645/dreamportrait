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
const multer = require('multer');
const upload = multer({dest: './images'})
const sharp = require('sharp');
const fs = require('fs');
const atob = require('atob');
var enforce = require('express-sslify');
const openssl = require('openssl-nodejs')

// const paypal = require('paypal-rest-sdk');
// const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

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
const reviews = require('./routes/reviews');
const successPay = require('./routes/successPay');
const successReg = require('./routes/successReg');
const artIsDone = require('./routes/artIsDone');
const leaveComment = require('./routes/leaveComment');
const successMsgContact = require('./routes/successMsgContact');
const reviewForm = require('./routes/reviewForm');

var Order = require('./models/order');
var Comment = require('./models/comment');
var productOrder = require('./models/productOrder');


const app = express();


// mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@' + process.env.MONGOCLASTER + '?retryWrites=true&w=majority');
require('./config/passport');
const ObjectId = require("mongoose");
// mongodb


// view engine hbs setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
// view engine hbs setup

app.use(logger('dev'));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
if (!process.env.IS_DEVELOPMENT)
{
    app.use(enforce.HTTPS({ trustProtoHeader: true }));    
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/user', userRoutes);
app.use('/', routes);

app.use('/order-page', orderPage);
app.use('/contact-us', contactUs);
app.use('/admin-page', adminPage);
app.use('/terms-of-service', termsOfService);
app.use('/privacy-policy', privacyPolicy);
app.use('/refund-policy', refundPolicy);
app.use('/f-a-q', faq);
app.use('/home-page', homePage);
app.use('/cart-page', cartPage);
app.use('/reviews-page', reviews);
app.use('/leave-comment', leaveComment);
app.use('/success-pay', successPay);
app.use('/success-reg', successReg);
app.use('/art-is-done', artIsDone);
app.use('/success-msg-contact', successMsgContact);
app.use('/review-form', reviewForm);

function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

app.post("/update-payment-status", (req, res) => {
    const orderId = req.body.orderId;

    Order.findByIdAndUpdate(orderId, { isPayed: true }, (err, order) => {
        if (err) {
            res.send(err);
        } else {
            // send an email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dreamportraitstore@gmail.com',
                    pass: '34yiuOH87%$#'
                }
            });

            // const reviewsList = order.products.map(product => product.comment.url).join("\n");

            let mailOption = {
                from: 'dreamportraitstore@gmail.com',
                to: req.user.email,
                subject: 'Dream Portrait Order',
                // text: 'Thanks for the ASS , you can leave tyhe comment here: \n\n' + reviewsList
                text: 'Thanks for the SOSI1'
            };

            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    console.log(err);
                    res.send();
                } else {
                    res.redirect('/user/profile');
                }
            });
        }
    });
});

app.post("/create-order", /*upload.single("avatar"),*/ (req, res) => {
    const secretKey = process.env.SECRET_PAY_KEY;
    const merchantAccount = process.env.MERCHANT_ACCOUNT;
    const merchantDomainName = process.env.MERCHANT_DOMAIN;

    const rootFolder = __dirname + `${path.sep}public${path.sep}images${path.sep}orders${path.sep}`;

    if (!fs.existsSync(rootFolder)){
        fs.mkdirSync(rootFolder);
    }

    const order = new Order({
        user: req.user,
        products: req.body.order.map(o => {
            // save image to the file system
            const file = decodeBase64Image(o.image);
            const imageName = Math.random().toString().substr(2, 20);
            const publicPath = imageName + '.' + file.type.split('/')[1];
            const publicMiniPath = imageName + '-mini.' + file.type.split('/')[1];
            const filePath = rootFolder + publicPath

            fs.writeFile(filePath, file.data, function (err) {
                console.log(err);

                // save mini image
                sharp(filePath).resize({width: 200})
                    .toFile(rootFolder + publicMiniPath)
                    // .then(function (newFileInfo) {
                    //     console.log("Image Resized");
                    // })
                    .catch(function (err) {
                        console.log("Got Error " + err);
                    });
            });

            const randomText = crypto.randomBytes(50).toString('hex');
            const baseLink = req.protocol + "://" + req.headers.host + '/review-form/';

            return {
                selectedBakcground: o.backgroundName,
                imagePath: '/images/orders/' + publicPath,
                imageMiniPath: '/images/orders/' + publicMiniPath,
                selectedPeople: o.peopleId,
                comment: new Comment({
                    url: baseLink + randomText
                }),
                wishesText: o.text,
                price: o.price
            }
        })
    });

    order.save(function (err, result) {
        // console.log(err);
        if (!err) {
            const orderId = result.id;
            const productName = req.body.order.map(o => o.peopleId + o.backgroundName);
            const productCount = req.body.order.map(() => 1);
            const productPrice = req.body.order.map(o => o.price);

            const orderDate = new Date().getTime();
            const currency = 'USD';
            const amount = req.body.order.reduce((acc, o) => acc + o.price, 0);
            const orderDataText = merchantAccount + ';' + merchantDomainName + ';' + orderId + ';' + orderDate + ';' +
                amount + ';' + currency + ';' + productName.join(';') + ';' + productCount.join(';') + ';' + productPrice.join(';');
            // console.log(orderDataText);
            const hashData = require("crypto").createHmac("md5", secretKey)
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;