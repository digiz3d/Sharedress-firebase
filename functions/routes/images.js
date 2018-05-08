const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const images = db.collection('images');

router.get('/', (req, res) => {
    let docs = [];

    images.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                docs.push(doc.data());
            });
            res.send(docs);
        })
        .catch(e => {
            res.send(e);
        });
});

router.post('/', (req, res) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.send('The name is empty');
    }
    if (!req.body.url || req.body.url.trim() === "") {
        return res.send('The URL is empty');
    }
    
    images.add({
        name: req.body.name,
        url: req.body.url
    })
    .then(ref => {
        res.send('File received');
    })
    .catch(e => {
        res.send('Error adding image');
    });
    

    /*
    res.send(JSON.stringify({
        url: req.url,
        query: req.query,
        baseUrl: req.baseUrl,
        body: req.body,
    }));
    */
});

module.exports = router;