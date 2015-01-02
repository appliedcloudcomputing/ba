var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

GLOBAL.Parse = require('parse').Parse;
if(process && process.env && process.env.APPLICATION_ID && process.env.JAVASCRIPT_KEY && process.env.MASTER_KEY) {
    Parse.initialize(process.env.APPLICATION_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
} else {
    Parse.initialize("PME7lKHj8eotzuQfdx4JpeiJyWxWYUa3gyOCnKiL", "Vz8UTQy0oBatlwjW7XSz8g0ZBw4RTmOGRm1p1Cts", "Ek2SiEsM7wlx3p9CZYlmv1GEep3kWFwGYLG1Dfx2");
}

var routes = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var clients = require('./routes/clients');

var app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/users', users);
app.use('/clients', clients);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// ERROR HANDLERS

// DEVELOPMENT ERROR HANDLER
// WILL PRINT STACKTRACE
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log("ERROR MESSAGE: " + err.message + " ERROR STATUS: " + err.status);
        /*res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log("ERROR MESSAGE: " + err.message + " ERROR STATUS: " + err.status);
    /*res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });*/
});


module.exports = app;
