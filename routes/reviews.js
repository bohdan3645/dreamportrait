var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASSWORD + '@cluster0.gdpfy.mongodb.net/test?retryWrites=true&w=majority');
var Comment = require('../models/comment');


/* GET reviews page. */
router.get('/', function(req, res, next) {
    res.render('shop/reviews', { title: 'shopp' });
});



router.post('/submit', (req, res, next) => {

    try {
        var nameComment = req.body.nameForComment;
        var emailComment = req.body.emailForComment;
        var comment = req.body.comment;

        new Comment({
                user: req.user,
                nameComment: nameComment,
                emailComment: emailComment,
                comment: comment
            })

            .save(function(err, result) { console.log(err); });
        res.send();
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;