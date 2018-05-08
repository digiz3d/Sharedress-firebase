const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const sets = db.collection('sets');

router.get('/', (req, res) => {
    let docs = [];

    sets.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                docs.push(doc.data());
            });
            res.send(docs);
        })
        .catch(e => res.send(e));
});

router.post('/',(req, res) => {
    if (!req.body.left || req.body.left.trim() === '') {
        return res.send("Empty Image 1 ID...");
    }
    if (!req.body.right || req.body.right.trim() === '') {
        return res.send("Empty Image 2 ID...");
    }

    sets.add({
        left: req.body.left,
        right: req.body.right
    }).then(ref => {
        return res.send('successfully created '+ref.id);
    }).catch(e => {
        return res.send('error '+e);
    })
});

module.exports = router;