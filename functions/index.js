// required libraries
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// initialization
admin.initializeApp();
const app = express();

// routes
const index = require('./routes/index');
const authenticate = require('./routes/authenticate');
const collections = require('./routes/collections');
const sets = require('./routes/sets');
const images = require('./routes/images');

app.use(cors({ origin: true }));
// using routes
app.use('/', index);
app.use('/authenticate', authenticate);
app.use('/collections', collections);
app.use('/sets', sets);
app.use('/images', images);

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


const db = admin.firestore();
const imagesCollection = db.collection('images');

const onFileUpload = functions.storage.object().onFinalize((img) => {
    console.info('adding : ' + img.name);
    imagesCollection.add({
        name: img.name,
        url: '',
        storageId: img.name,
        creationTimestamp: Date.now()
    }).then(result => {
        console.info('added : ' + result.id);
        return true;
    }).catch(err => {
        console.info('failed to add the file');
        console.info(err);
    });
    return true;
});

const onFileDelete = functions.storage.object().onDelete((img) => {
    imagesCollection.where('storageId', "==", img.name).get()
        .then((snapshot) => {
            console.info('starting to delete for storageId == '+ img.name);
            snapshot.forEach((doc) => {
                console.info('deleting : ' + doc.id);
                doc.ref.delete()
                    .then(r => {
                        console.info('deleted the image');
                        return true;
                    })
                    .catch(err => {
                        console.info('failed to delete the image');
                        console.info(err);
                    });
                return true;
            });
            return true;
        })
        .catch(err => {
            console.warn(err);
        });
    return true;
});

module.exports = {
    api,
    onFileUpload,
    onFileDelete
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });