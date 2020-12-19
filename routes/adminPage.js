var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var ProductOrder = require('../models/productOrder');
var ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
const {sendEmail} = require("../helper");
const fs = require('fs');

const isAdmin = (roles, user) => {
    if (!user) {
        return false;
    }

    return !!roles.find(role => user.role === role);
};

const checkIsInRole = (...roles) => (req, res, next) => {
    if (isAdmin(roles, req.user)) {
        return next();
    }

    return res.redirect('/user/signin');
}

router.post('/upload-art-image', checkIsInRole("admin"), function (req, res, next) {
    const image = req.body.image;
    const date = req.body.uploadedAt;
    const id = req.body.id;

    Order.update({'products._id': ObjectId(id)}, {
        "$set": {
            "products.$.artImage": image,
            "products.$.artImageCreatedAt": date
        }
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            Order.findOne({'products._id': ObjectId(id)}, (err, order) => {
                //TODO: It does not work
                const product = order.products.find(product => product.id === id);

                if (!product) {
                    res.send("no product found");
                }

                fs.readFile('./views/mailTemplates/review-mail.html', (err, data) => {
                    let reviewText = data.toString('utf8');
                    reviewText = reviewText.replace('$1', product.comment.url);

                   
                    sendEmail(req.user.email, 'Dream Portrait Art', reviewText, () => res.send(), () => res.send(order));
                });
                fs.readFile('./views/mailTemplates/download-art-mail.html', (err, data) => {
                    let reviewText = data.toString('utf8');
                    artText = artText.replace('$2', accountLink);

                    sendEmail(req.user.email, 'Dream Portrait Art', artText, () => res.send(), () => res.send(order));

                    // const accountLink = req.protocol + "://" + req.headers.host + '/user/profile/';
                    // const artText = `Thanks for the SOSI2:\nArt Image:\n<a href="${accountLink}" target="_blank">Download</a>`;
                    // sendEmail(req.user.email, 'Dream Portrait Art', artText, () => res.send(), () => res.send(order));
                });
            });
        }
    });
});

/* GET admin page. */
router.get('/', checkIsInRole("admin"), function (req, res, next) {
    Order.find({}, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }

        res.render('admin/adminPage', {
            orders: orders
                .filter(o => o.isPayed)
                .reduce((acc, o) => acc.concat(o.products), [])
                .map(p => {
                    const tedt = new Date(p.artImageCreatedAt);
                    return {
                        id: p._id,
                        orderId: p.orderId,
                        isPayed: p.isPayed,
                        artImage: p.artImage,
                        artImageCreatedAt: tedt.getDate().toString() + "." + tedt.getMonth().toString() + "." + tedt.getFullYear().toString(),
                        imagePath: p.imagePath,
                        selectedPeople: p.selectedPeople,
                        selectedBakcground: p.selectedBakcground,
                        wishesText: p.wishesText,
                        price: p.price,
                    };
                })
        });
    });

});

module.exports = router;