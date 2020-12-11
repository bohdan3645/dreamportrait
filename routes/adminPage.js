var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var ProductOrder = require('../models/productOrder');
var ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');

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
                const product = order.products.find(product => product._id === ObjectId(id));

                if (!product) {
                    res.send("no product found");
                }

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dreamportraitstore@gmail.com',
                        pass: '34yiuOH87%$#'
                    }
                });

                let mailOption = {
                    from: 'dreamportraitstore@gmail.com',
                    to: req.user.email,
                    subject: 'Dream Portrait Art',
                    text: `Thanks for the SOSI2:\n
                    Art Image:\n${product.artImage}\n\n
                    You can leave a comment here:\n${product.comment.url}`
                };

                transporter.sendMail(mailOption, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.send();
                    } else {
                        res.send(order);
                    }
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