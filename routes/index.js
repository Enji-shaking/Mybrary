const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

// as of now, it's not hooked up

module.exports = router