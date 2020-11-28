var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var ProductOrder = require('../models/productOrder');
var ObjectId = require('mongodb').ObjectID;

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
    }, function (err, order) {
        if (err) {
            res.send(err);
        } else {
            res.send(order);
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
            orders: orders.reduce((acc, o) => acc.concat(o.products), [])
                .map(p => {
                    const tedt = new Date(p.artImageCreatedAt);
                    return {
                        id: p._id,
                        orderId: p.orderId,
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