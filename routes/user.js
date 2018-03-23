var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');


router.get('/forgot', notLoggedIn, function (req,res,next) {
    var messages = req.flash('error');
    res.render('user/forgot', {messages: messages, hasErrors: messages.length > 0})
});

router.post('/forgot', notLoggedIn, function (req,res,next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({email: req.body.email}, function (err, user) {
                if(!user){
                    req.flash('error','No account with that eamil address exists.');
                    return res.redirect('/user/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port:587,
                auth: {
                    user: 'abhinava.srirajan@gmail.com',
                    pass: 'iamursmydear'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'abhinava.srirajan@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password. '+'\n'+'Please click on the following link, or paste this into your browser to complete the process.'+'\n\n'+
                'http://'+req.headers.host+'/user/reset/'+token+'\n\n'+
                'If you did not request this, please ignore this email and your password will remain unchanged.'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash('success', 'An email has been sent to '+ user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if(err) return next(err);
        res.redirect('/user/forgot');
    });
});

router.get('/reset/:token', notLoggedIn, function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function (err, user) {
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/user/forgot');
        }
        res.render('user/reset',{token: req.params.token});
    });
});


router.post('/reset/:token',notLoggedIn, function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                }
                else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'abhinava.srirajan@gmail.com',
                    pass: 'iamursmydear'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'abhinava.srirajan@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/design',isLoggedIn, function(req,res,next){
	res.render('user/design');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    req.flash("success","See you later!");
    res.redirect('/');
    req.session.destroy();
});


router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

 //Login
router.get('/signup', function(req,res,next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//register user
router.post('/signup',passport.authenticate('local-signup', {
	successRedirect: '/user/design',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function (req,res,next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/user/design',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin');
}
