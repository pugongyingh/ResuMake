var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var sessionStore = require('connect-mongo')(session);

require('./config/auth.js');
var mongoose = require('mongoose');



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// mongoose.connect('mongodb://localhost/cvdetails', {useMongoClient : true});
mongoose.connect('mongodb://abhi0515:beapartofmine05@ds115045.mlab.com:15045/resume-0515', {useMongoClient : true});
var db = mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
	console.log('connection successfull');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',hbs({extname:'hbs',layoutsDir:__dirname+'/views'})); 
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: ' secret',
  saveUninitialized: true,
  store: new sessionStore({mongooseConnection: mongoose.connection}),
  resave: true,
  cookie: {maxAge:15*3600}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);


// Express Validator
app.use(expressValidator({
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

// COnnect Flash
app.use(flash());

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

var http = require("http");
setInterval(function() {
    http.get("http://resumake-0515.herokuapp.com");
}, 300000); // every 5 minutes (300000)

module.exports = app;
