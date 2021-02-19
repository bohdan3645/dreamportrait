var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var ProductOrder = require('../models/productOrder');
var ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
const {sendEmail} = require("../helper");
const fs = require('fs');

const mongoose = require('mongoose');

const moment = require('moment');

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
                    const accountLink = req.protocol + "://" + req.headers.host + '/user/profile/';
                    let artText = data.toString('utf8');
                    // artText = artText.replace('${accountLink}');

                    sendEmail(req.user.email, 'Dream Portrait Art', artText, () => res.send(), () => res.send(order));
                });
            });
        }
    });
});

/* GET admin page. */
router.get('/', checkIsInRole('admin'), function (req, res, next) {
  Order.find({}, function (err, orders) {
    if (err) return res.write('Error!')

    const result = []

    orders.forEach(function (order) {
      if (!order.isPayed) return

      order.products.forEach(function (p) {
        result.push({
          id: p._id,
          orderIdNumber: order.idNumber,
          orderId: p.orderId,
          isPayed: p.isPayed,
          artImage: p.artImage,
          artImageCreatedAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm'),
          imageUrl: p.imageUrl,
          selectedPeople: p.selectedPeople,
          selectedBakcground: p.selectedBakcground,
          wishesText: p.wishesText,
          price: p.price,
          email: p.email,
        })
      })
    })

    res.render('admin/adminPage', { orders: result })
  })
})

router.get('/review', checkIsInRole('admin'), (req, res, next) => {
  res.render('admin/review')
})

router.post('/review', checkIsInRole('admin'), async (req, res, next) => {
  const Review = mongoose.model('Review')
  const {
    customerName,
    rate,
    imageUrl,
    body,
  } = req.body

  try {
    await Review.create({ customerName, rate, imageUrl, body, fake: true })
    res.redirect('/admin-page')
  } catch (err) {
    console.error(err)
    res.send(err)
  }
})

router.delete('/review/:id', checkIsInRole('admin'), async (req, res, next) => {
  const Review = mongoose.model('Review')

  try {
    const _id = ObjectId(req.params.id)
    await Review.findOneAndRemove({ _id })

    res.send({ ok: 1 })
  } catch (err) {
    console.error(err)
    res.send(err)
  }
})

module.exports = router;
