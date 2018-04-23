const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

function getMultiple(db) {
    db.collection('clothes').get()
        .then(snapshot => {
            console.error('yeaah');
            console.error('omg : ' + typeof snapshot);
            console.error(snapshot);
            return snapshot;
        })
        .catch(err => {
            console.error('naaah');
            throw err;
        });
}


router.get('/', (req, res, next) => {
    let r;

    try {
        let temp = getMultiple(db);
        r = temp;
        console.error('successssss');
    }
    catch (err) {
        r = 'AH.';
        console.error('failllll');
    }

    res.send(r);
});

module.exports = router;