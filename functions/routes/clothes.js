const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const collection = db.collection('clothes');

router.get('/', (req, res, next) => {

    let prom = collection.get();

    prom.then((v) => {
        return res.send(v.docs);
    }).catch((e) => {
        return res.send(e);
    });
});

module.exports = router;