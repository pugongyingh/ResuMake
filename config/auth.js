var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var RegisterData = require('../models/user');

passport.serializeUser(function(user,done){
      done(null,user.id);
})

passport.deserializeUser(function(id, done) {
  RegisterData.findById(id, function(err, user) {
    if(err) {
      return console.log(err.message);
    }
    return done(null, user);
  })
})



passport.use('local-signup', new localStrategy({
      usernameField : 'eemail',
      passwordField : 'paassword',
      passReqToCallback : true
  },
  function(req, email, password, done) {
      console.log('validation2');
  /*req.checkBody('userrname', 'Name is required').notEmpty();
  console.log('validation2');*/
  /*req.checkBody('email', 'Email is required').notEmpty().isEmail();
  console.log('validation3');
  req.checkBody('password', 'Password is required').notEmpty();
  console.log('validation4');
  /*req.checkBody('paassword2', 'Passwords do not match').equals(req.body.paassword);
  console.log('validation5');*/
    /*req.getValidationResult.then(function(errors){
      var errorMessage = [];
      errors.forEach(function(error){
        errorMessage.push(error.msg);
      });
      return done(null, false, req.flash('error', errorMessage));
    })*/

  	RegisterData.findOne({emailid:email}, function(err,user){
      console.log('Entered user Function');
  		if(err) return done(err);
      console.log('validation2');
  		if(user) {return done(null, false, {message:'User already exists!'});
      console.log('validation3');}
  		else{
        console.log('validation4');
  			var newUser = new RegisterData();
  			newUser.username = req.body.userrname;
		    newUser.emailid = email;
		    newUser.password = newUser.generateHash(password);
        console.log('after request');
        newUser.save(function(err){
          if(err){
            console.log('Error Occured');
            return done(null, false, {message:'Error in Database'});
          }
          return done(null, newUser);
        });
  		}
  	})
  })
)


