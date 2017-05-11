var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var MongoDBStore = require('connect-mongodb-session')(session);
var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');
var users = require('./routes/users');
var gamescreen = require('./routes/gamescreen');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var url = process.env.MLAB_SPACEGAMEDB_URL;

var store = new MongoDBStore({
uri : url,
collection : 'sessions'
}, function(error) {
// todo deal with error connection
if (error) console.log(error)
});

app.use(session({
secret: "put a random string here",
resave: false,
saveUninitialized: false,
store: store
}));



require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());         // This creates an req.user variable for logged in users.
app.use(flash());

mongoose.connect(url)

MongoClient.connect(url, function(err, db) {
 
 app.use('/', function(req, res, next){
    req.db = db;
    next();
  });

  
app.use('/', index);
app.use('/users', users);
app.use('/gamescreen/', gamescreen)
// Move route handling to code in routes/gamescreen.js
// app.get('/gamescreen', function(req, res){
//   res.render('gamescreen');
// });



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
});//end of MongoDB connect
module.exports = app;
