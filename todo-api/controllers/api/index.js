const router = require('express').Router(),
    login = require('./login');

router.use('/login', login);

module.exports = router;