const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const collections = db.collection('collections');
const sets = db.collection('sets');

router.get('/', (req, res) => {
    let docs = {};

    collections.orderBy('creationTimestamp', 'desc').get()
        .then(documents => {
            documents.forEach(doc => {
                docs[doc.id] = doc.data();
                docs[doc.id].id = doc.id;
                docs[doc.id].sets = docs[doc.id].sets.map((elem) => elem.ref.id);
            });

            return res.send(docs);
        })
        .catch(e => {
            console.log('Error getting collection', e.message);
            res.send(e);
        });
    return true;
});

router.post('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.name || req.body.name.trim() === "") {
            reject(Error("empty collection name..."));
        }
        resolve();
    })
        .then(() => {
            return collections.doc(req.body.name).get()
        })
        .then(doc => {
            if (doc.exists) {
                throw new Error('Le document existe déjà et il vaut : ' + JSON.stringify(doc.data()))
            }
            return;
        })
        .then(() => {
            return collections.doc(req.body.name).set({
                name: req.body.name,
                creationTimestamp: Date.now(),
                sets: []
            });
        })
        .then(ref => {
            return res.send('Successfully added ' + req.body.name);
        })
        .catch(e => {
            console.log('Error getting collection : ', e.message);
            res.send('Error posting a new document.');
        });
    return true;
});



router.patch('/:collectionId', (req, res) => {

    let oldData;
    let oldArray;

    new Promise((resolve, reject) => {
        if (req.params.collectionId.trim() === "") {
            return reject(new Error('Empty collection ID.'));
        }

        if (!req.body.set || req.body.set.trim() === "") {
            return reject(new Error('Empty set ID.'));
        }

        return resolve();
    })
        .then(() => {
            return collections.doc(req.params.collectionId).get();
        })
        .then(collectionDocument => {
            if (!collectionDocument.exists) {
                throw new Error('Specified collection does not exist...');
            }

            oldData = collectionDocument.data();
            return true;
        })
        .then(() => {
            return sets.doc(req.body.set).get();
        })
        .then(setDocument => {
            if (!setDocument.exists) {
                throw new Error('Specified set doesn\'t exist...');
            }

            oldArray = oldData.sets || [];
            return collections.doc(req.params.collectionId).set({
                updateTimestamp: Date.now(),
                sets: oldArray.concat([{
                    order: oldArray.length,
                    ref: setDocument.ref
                }]),
            }, { merge: true });
        })
        .then(ref => {
            res.send('Successfully added ' + req.params.collectionId);
            return true;
        })
        .catch(err => {
            console.log('Error adding set to collection', err.message);
            res.send('Error adding set to collection.');
        });
    return true;
});

module.exports = router;