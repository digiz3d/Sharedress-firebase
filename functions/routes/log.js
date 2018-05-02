const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const collection = db.collection('logs');

router.get('/', (req, res, next) => {

    let prom = collection.add({
        url: req.url,
        query: req.query,
        baseUrl: req.baseUrl,
        body: req.body,
    });

    prom.then((v) => {
        return res.send(v.docs);
    }).catch((e) => {
        return res.send(e);
    });
});

module.exports = router;