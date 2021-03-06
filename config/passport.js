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

	 await body('firstName').notEmpty().withMessage('First name is a required field').run(req);
	 await body('lastName').notEmpty().withMessage('Last name is a required field').run(req);
	 await body('email').notEmpty().isEmail().withMessage('E-mail will be contain email').run(req);
	 await body('password').notEmpty().isLength({min: 6}).withMessage('Password must be at least 6 characters long').run(req);
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
		newUser.firstName = req.body.firstName;
		newUser.lastName = req.body.lastName;
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