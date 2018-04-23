const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

router.get('/', (req, res, next) => {

    let prom = db.collection('clothes').get();

    prom.then((v) => {
        return res.send(v.docs);
    }).catch((e) => {
        return res.send(e);
    });
});

module.exports = router;