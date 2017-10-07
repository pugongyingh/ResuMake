var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var RegisterData = require('../models/user');

/* Register */
/*router.get('/signin', function(req, res, next) {
  res.send('register');
});

router.post('/signin',passport.authenticate('local-signin', {
	successRedirect: '/index',
	failureRedirect: '/users/signin',
	failureFlash: true,
}));
*/

 //Login
 router.get('/signup', function(req, res, next) {
  res.send('login');
});

//register user
router.post('/signup',passport.authenticate('local-signup', {
	successRedirect: '/design',
	failureRedirect: '/',
	failureFlash: false,
}));


module.exports = router;
