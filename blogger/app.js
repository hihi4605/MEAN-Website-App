var createError = require('http-errors');

var express = require('express');

var path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { promiseHooks } = require('v8');
require('./app_api/models/db');
var app = express();
var passport = require('passport');
require('./app_api/config/passport');
// view engine setup
app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'ejs');
var io = require('socket.io')(app.listen(3000));

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

 
var routesApi = require('./app_api/routes/index');
app.use(passport.initialize());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client'))); 
 
app.use('/api',routesApi);
 

 
// Added per Lab 5 - Angular

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'))
});

 
     
console.log('app.js loaded');
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
