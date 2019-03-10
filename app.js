require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const cors = require('cors');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const path = require('path');

const app = express();
require('./config/db');
//----------------------------------------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', (express.static(path.join(__dirname, 'uploads'))));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({secret: 'passport-tutorial', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

app.use(cookieParser());
app.use(fileUpload());
//----------------------------------------------------------------------------------------------------------------------
require('./models');
require('./config/passport');

app.use(require('./routes'));

//--------------------------------------------------------------------------------------------------------------------//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    next();
});

module.exports = app;
