const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const collections = db.collection('collections');
const sets = db.collection('sets');

router.get('/', (req, res) => {
    let docs = [];

    collections.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                docs.push(doc.data());
            });
            return res.send(docs);
        })
        .catch(e => {
            console.log('Error getting collection', e.message);
            res.send(e);
        });
    return;
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
            return true;
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
    return;
});



router.patch('/:name', (req, res) => {
    if (req.params.name.trim() === "") {
        return res.send("Empty Collection ID...");
    }

    if (!req.body.set || req.body.set.trim() === "") {
        return res.send("Empty Set ID...");
    }

    collections.doc(req.params.name).get()
        .then(collectionDocument => {
            if (!collectionDocument.exists) {
                return res.send("Specified collection does not exist...")
            }

            const oldData = collectionDocument.data();

            sets.doc(req.body.set).get()
                .then(setDocument => {
                    if (!setDocument.exists) {
                        return res.send('Specified set doesn\'t exist...')
                    }

                    const oldArray = oldData.sets || [];
                    collections.doc(req.params.name).set({
                        updateTimestamp: Date.now(),
                        sets: oldArray.concat([{
                            order: oldArray.length,
                            ref: setDocument.ref
                        }]),
                    }, { merge: true })
                        .then(ref => {
                            res.send('Successfully added ' + req.params.name);
                        })
                        .catch(err => {
                            console.log('Error adding set to collection', err);
                            res.send('Error adding set to collection');
                        });

                })
                .catch(err => {
                    console.log('Error getting set', err);
                    res.send('Error getting set');
                });
        })
        .catch(err => {
            console.log('Error getting collection', err);
            res.send('Error getting collection.');
        });
    return;
});

module.exports = router;