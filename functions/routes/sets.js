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

router.post('/:refImage1/:refImage2',(req, res) => {
    sets.add({
        img1: req.params.refImage1,
        img2: req.params.refImage2
    }).then(ref => {
        return res.send("successfully created "+ref.id);
    }).catch(e => {
        return res.send("error "+e);
    })
});

module.exports = router;