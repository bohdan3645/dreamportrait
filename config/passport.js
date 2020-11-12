var passport = require('passport');
const { body, validationResult } = require('express-validator');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.use('local.register', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => { 

	 var huy = await body('email').notEmpty().isEmail().withMessage('E-mail will be contain email').run(req);
	 await body('password').notEmpty().isLength({min: 6}).withMessage('Password will be at least 7 chars long').run(req);
	 const errors = validationResult(req);
  if (!errors.isEmpty()){ 
    
  	var messages = [];

  	errors.array().forEach(function(error) {messages.push(error.msg)});
     return done(null, false, req.flash('error', messages))
  }
	User.findOne({'email': email}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, {message: 'Email is already in use!'});
		} 
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.role = 'customer'
		newUser.save(function(err, result) {
			if(err) {
				return done(err);
			}
			return done(null, newUser);
		});

	});
}));



passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {

	 var huy = await body('email').notEmpty().isEmail().run(req);
	 await body('password').notEmpty().run(req);
	 const errors = validationResult(req);
  if (!errors.isEmpty()){ 
    
  	var messages = [];

  	errors.array().forEach(function(error) {messages.push(error.msg)});
     return done(null, false, req.flash('error', messages))
}
     User.findOne({'email': email}, function(err,user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {message: 'No user found!'});
		} 
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Wrong password!'});
		}
		return done(null, user);
	});

}));