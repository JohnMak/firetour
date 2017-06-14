var express         = require('express');
var path            = require('path');
var flash           = require('connect-flash');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var db              = require('./database/database.js');
//var restore_db      = require('./restore_db');
db.init();
//restore_db();


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var passport        = require('passport');
var authController  = require('./auth/auth_ctl.js');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





app.use('/', require('./routes/index'));

app.use('/api/direction', require('./direction/direction_rte.js'));
app.use('/api/subscription', require('./subscription/subscription_rte'));
app.use('/api/offer', require('./offer/offer_rte'));
app.use('/api/user', require('./user/user_rte.js'));
app.use('/api/auth', require('./auth/auth_rte.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
