const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const images = db.collection('images');

router.get('/', (req, res) => {
    let docs = {};

    images.get()
        .then(documents => {
            documents.forEach(doc => {
                docs[doc.id] = doc.data();
                docs[doc.id].id = doc.id;
            });

            return res.send(docs);
        })
        .catch(e => {
            console.log('Error getting images', e.message);
            res.send('Error getting images');
        });
    return true;
});

router.post('/', (req, res) => {

    new Promise((resolve, reject) => {
        if (!req.body.name || req.body.name.trim() === "") {
            return reject(new Error('The name is empty.'));
        }

        if (!req.body.url || req.body.url.trim() === "") {
            return reject(new Error('The URL is empty.'));
        }


        return resolve();
    })
        .then(() => {
            return images.add({
                name: req.body.name,
                url: req.body.url
            });
        })
        .then(ref => {
            res.send('File received');
            return true;
        })
        .catch(e => {
            console.log('Error adding image : ' + e.message)
            res.send('Error adding image.');
        });
    return true;
});

module.exports = router;