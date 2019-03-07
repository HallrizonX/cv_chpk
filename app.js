require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
//const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('morgan');

const multer = require('multer'); //new work with files


const app = express();
mongoose.Promise = bluebird;

//----------------------------------------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(cookieParser());

app.use(fileUpload()); // old
//----------------------------------------------------------------------------------------------------------------------
mongoose.set('useNewUrlParser', true );
mongoose.connect(process.env.MONGO_DB, err =>{
  if (err){
    throw err
  }
  console.log("Connect")
});
mongoose.set('debug', true);

require('./models/Users');
require('./config/passport');
app.use(require('./routes'));


app.post('/uploads/images/', (req, res)=>{

});

//--------------------------------------------------------------------------------------------------------------------//
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
