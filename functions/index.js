// required libraries
const functions = require('firebase-functions');

const express = require('express');

// initialization
const app = express();

// routes
const index = require('./routes/index');
const authenticate = require('./routes/authenticate');
const clothes = require('./routes/clothes');
// using routes
app.use('/', index);
app.use('/authenticate', authenticate);
app.use('/clothes', clothes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error from index.js : ' + err.message);
});

const api = functions.https.onRequest(app);

module.exports = {
    api
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });