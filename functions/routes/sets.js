const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();
const images = db.collection('images');
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

router.post('/', (req, res) => {
    if (!req.body.left || req.body.left.trim() === '') {
        return res.send('Empty Image 1 ID...');
    }
    if (!req.body.right || req.body.right.trim() === '') {
        return res.send('Empty Image 2 ID...');
    }

    let message = "";
    let leftRef;
    let rightRef;

    Promise.all([
        images.doc(req.body.left).get().then(leftImage => {
            if (!leftImage.exists) {
                return Promise.reject(new Error('Image 1 does not exist'));
            }
            return leftImage.ref;
        }).catch(e => {
            message += 'Failed getting Image 1' + e;
            return Promise.reject(new Error('Failed getting Image 1'));
        }),
        images.doc(req.body.right).get().then(rightImage => {
            if (!rightImage.exists) {
                return Promise.reject(new Error('Image 2 does not exist'));
            }
            return rightImage.ref;
        }).catch(e => {
            message += 'Failed getting Image 2 ' + e;
            return Promise.reject(new Error('Failed getting Image 2'));
        }),
    ]).then(images => {
        sets.add({
            left: images[0],
            right: images[1]
        }).then(ref => {
            return res.send('Set successfully created ' + ref.id);
        }).catch(e => {
            return res.send('Error adding the set : ' + e);
        });

        /*
        console.warn(message);
        res.send(JSON.stringify(images[0]));
        */
    }).catch((e) => {
        return res.send('One or more image doesnt exist ' + e);
    });
});

module.exports = router;