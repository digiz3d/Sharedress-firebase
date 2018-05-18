const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const images = db.collection('images');
const sets = db.collection('sets');

router.get('/', (req, res) => {
    let docs = {};

    sets.orderBy('creationTimestamp', 'desc').get()
        .then(documents => {
            documents.forEach(doc => {
                docs[doc.id] = doc.data();
                docs[doc.id].id = doc.id;
                // convert references to id
                docs[doc.id].leftImage = docs[doc.id].leftImage ? docs[doc.id].leftImage.ref.id : '';
                docs[doc.id].rightImage = docs[doc.id].rightImage ? docs[doc.id].rightImage.ref.id : '';
            });

            return res.send(docs);
        })
        .catch(e => {
            console.log('Error getting collection', e.message);
            res.send(e);
        });
    return true;
});
/*
router.get('/', (req, res) => {
    let docs = [];

    sets.get()
        .then(snapshot => {
            snapshot.forEach(doc => docs.push(doc.data()));
            return res.send(docs);
        })
        .catch(e => res.send(e));
    return true;
});
*/
router.post('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.left || req.body.left.trim() === '') {
            return reject(new Error('Empty image 1 ID.'));
        }
        if (!req.body.right || req.body.right.trim() === '') {
            return reject(new Error('Empty Image 2 ID...'));
        }
        return resolve();
    })
        .then(() => {
            return Promise.all([
                images.doc(req.body.left).get(),
                images.doc(req.body.right).get()
            ]);
        })
        .then(images => {
            leftImage = images[0];
            rightImage = images[1];
            if (!leftImage.exists) {
                throw new Error('Image 1 does not exist');
            }
            if (!rightImage.exists) {
                throw new Error('Image 2 does not exist');
            }

            return sets.add({
                leftImage: leftImage.ref,
                rightImage: rightImage.ref,
                creationTimestamp: Date.now()
            });
        }).then(ref => {
            let docs = {};
            ref.get().then(document => {
                docs[document.id] = document.data();
                docs[document.id].id = document.id;
                docs[document.id].leftImage = docs[document.id].leftImage ? docs[document.id].leftImage.ref.id : '';
                docs[document.id].rightImage = docs[document.id].rightImage ? docs[document.id].rightImage.ref.id : '';
                return res.send(docs);
            }).catch(err => {
                console.warn(err);
                return res.send(err.message);
            });
            return true;
        }).catch(e => {
            console.log('Error adding the set : ' + e.message);
            return res.send('Error adding the set');
        });
    return true;
});

/*
router.post('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.left || req.body.left.trim() === '') {
            return reject(new Error('Empty image 1 ID.'));
        }
        if (!req.body.right || req.body.right.trim() === '') {
            return reject(new Error('Empty Image 2 ID...'));
        }
        return resolve();
    })
        .then(() => {
            return Promise.all([
                images.doc(req.body.left).get().then(leftImage => {
                    if (!leftImage.exists) {
                        return Promise.reject(new Error('Image 1 does not exist'));
                    }
                    return Promise.resolve(leftImage.ref);
                }).catch(e => {
                    return Promise.reject(new Error('Failed getting Image 1'));
                }),
                images.doc(req.body.right).get().then(rightImage => {
                    if (!rightImage.exists) {
                        return Promise.reject(new Error('Image 2 does not exist'));
                    }
                    return Promise.resolve(rightImage.ref);
                }).catch(e => {
                    return Promise.reject(new Error('Failed getting Image 2'));
                }),
            ]);
        })
        .then(images => {
            return sets.add({
                left: images[0],
                right: images[1]
            });
        }).then(ref => {
            return res.send('Set successfully created ' + ref.id);
        }).catch(e => {
            return res.send('Error adding the set : ' + e);
        });
    return true;
});
*/
module.exports = router;