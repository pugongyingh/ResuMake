var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function(user,done){
      done(null,user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      return console.log(err.message);
    }
    return done(null, user);
  })
});


passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, email, password, done) {
      console.log('validation2');
  req.checkBody('username', 'Name is required').notEmpty();
  console.log('validation2');
  req.checkBody('email','Invalid Email').notEmpty().isEmail();
  req.checkBody('password','Invalid Password').notEmpty().isLength({min:5});
  req.checkBody('confirm', 'Passwords do not match!').equals(req.body.password);
      var errors = req.validationErrors();
      if(errors){
          var messages = [];
          errors.forEach(function(error){
              messages.push(error.msg);
          });
          return done(null, false, req.flash('error', messages));
      }

  	User.findOne({email:email}, function(err, user){
      console.log('Entered user Function');
  		if(err) return done(err);
      console.log('validation2');
  		if(user) {
            return done(null, false, {message: 'User already exists!'});
        }
  		else{
        console.log('validation4');
  			var newUser = new User();
  			newUser.username = req.body.username;
		    newUser.email = email;
		    newUser.password = newUser.generateHash(password);
        console.log('after request');
        newUser.save(function(err, result){
          if(err){
            console.log('Error Occured');
            return done(null, false, {message:'Error in Database'});
          }
          return done(null, newUser);
        });
  		}
  	});
  }));


passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid Password').notEmpty();
    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email},function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'No user found.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong Password.'});
        }
        return done(null, user);
    });
}));