var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var validator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var sessionStore = require('connect-mongo')(session);


require('./config/passport.js');
var mongoose = require('mongoose');



var index = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

// mongoose.connect('mongodb://localhost/cvdetails', {useMongoClient : true});
//mongoose.connect('mongodb://abhi0515:beapartofmine05@ds115045.mlab.com:15045/resume-0515', {useMongoClient : true});
mongoose.connect('mongodb://127.0.0.1:27017/resumake');
var db = mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
	console.log('connection successfull');
});

require('./config/passport');

// view engine setup
app.engine('.hbs',hbs({defaultLayout: 'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  saveUninitialized: true,
  store: new sessionStore({mongooseConnection: mongoose.connection}),
  resave: true,
  cookie: { maxAge: 180* 60 * 1000  }
}));

app.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    res.locals.dbs = db.collection('users');
    res.locals.sessionFlash = req.session.sessionFlash;
    res.locals.messages = require('express-messages')(req,res);
    next();
});


// Express Validator
app.use(validator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));


app.use('/user', userRoutes);
app.use('/', index);


// Global Vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
var http = require('http');
setInterval(function() {
    http.get("http://resumake-0515.herokuapp.com");
    console.log("executed");
}, 300000); // every 5 minutes (300000)
*/

module.exports = app;
