var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

GLOBAL.Parse = require('parse').Parse;
if(process && process.env && process.env.APPLICATION_ID && process.env.JAVASCRIPT_KEY && process.env.MASTER_KEY) {
    Parse.initialize(process.env.APPLICATION_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
} else {
    Parse.initialize("PME7lKHj8eotzuQfdx4JpeiJyWxWYUa3gyOCnKiL", "Vz8UTQy0oBatlwjW7XSz8g0ZBw4RTmOGRm1p1Cts", "Ek2SiEsM7wlx3p9CZYlmv1GEep3kWFwGYLG1Dfx2");
}

var routes = require('./routes/index');
var login = require('./routes/login');
var client = require('./routes/client');
var product = require('./routes/product');
var invoice = require('./routes/invoice');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'PME7lKHj8eotzuQfdx4JpeiJyWxWYUa3gyOCnKiL',
                resave: true,
                saveUninitialized: false}));

app.use('/', routes);
app.use('/login', login);
app.use('/client', client);
app.use('/product', product);
app.use('/invoice', invoice);

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
        console.log("----------------------------------------------ERROR OBJECT: " + JSON.stringify(err));
        console.log("----------------------------------------------ERROR MESSAGE: " + err.message);
        console.log("----------------------------------------------REQUEST URL: " + req.url);
        if(req.session.user){            
            res.render('404', {
                message: err.message,
                error: err,
                loggedIn: "true"
            });
        } else {            
            res.render('404', {
                message: err.message,
                error: err     
            });            
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("----------------------------------------------ERROR OBJECT: " + JSON.stringify(err));
    console.log("----------------------------------------------ERROR MESSAGE: " + err.message);
    console.log("----------------------------------------------REQUEST URL: " + req.url);
    res.render('404', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
