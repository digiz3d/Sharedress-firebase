const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const images = db.collection('images');

router.get('/', (req, res) => {
    let docs = {};

    images.orderBy('creationTimestamp', 'desc').get()
        .then(documents => {
            documents.forEach(doc => {
                docs[doc.id] = doc.data();
                docs[doc.id].id = doc.id;
                if (!docs[doc.id].url && docs[doc.id].storageId) {
                    docs[doc.id].url = 'https://firebasestorage.googleapis.com/v0/b/sharedress-app.appspot.com/o/'
                        + encodeURIComponent(docs[doc.id].storageId)
                        + '?alt=media';
                }
            });
            return res.send(docs);
        })
        .catch(e => {
            console.log('Error getting images', e.message);
            //res.send('Error getting images');
        });
    return true;
});

router.get('/last', (req, res) => {
    let docs = {};
    images
        //.where('creationTimestamp', '>=', 0)
        .orderBy('creationTimestamp', 'desc')
        .limit(1)
        .get()
        .then((snapshot) => {
            snapshot.forEach(doc => {
                docs[doc.id] = doc.data();
                docs[doc.id].id = doc.id;
            });
            return res.send(docs);
        })
        .catch(err => {
            console.warn(err);
            return res.send(err.message);
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
                url: req.body.url,
                storageId: '',
                creationTimestamp: Date.now()
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

router.patch('/:imageId', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.tags) {
            return reject(new Error('Tags can\'t be empty'));
        }
        return resolve();
    }).then(() => {
        return images.doc(req.params.imageId).update({ tags: req.body.tags });
    }).then(ref => {
        return res.json({ success: true });
    }).catch(e => {
        console.log('Error adding image : ' + e.message);
        return res.json({ error: true, message: 'Image not found.' });
    });
    return true;
});
module.exports = router;