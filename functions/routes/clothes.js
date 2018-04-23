const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

function getMultiple(db) {
    return db.collection('clothes').get()
        .then(snapshot => {
            return snapshot;
        })
        .catch(err => {
            throw err;
        });
}


router.get('/', (req, res, next) => {

    let prom = getMultiple(db);
    prom.then((v) => {
        return res.send(v.docs);
    }).catch((e) => {
        return res.send(e);
    });
});

module.exports = router;