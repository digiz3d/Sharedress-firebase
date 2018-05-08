const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bon là on va s\'authentifier');
});

module.exports = router;