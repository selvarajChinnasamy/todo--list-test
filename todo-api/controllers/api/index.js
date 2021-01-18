const router = require('express').Router(),
    user = require('./user'),
    task = require('./task');

router.use('/user', user);
router.use('/task', task);

module.exports = router;