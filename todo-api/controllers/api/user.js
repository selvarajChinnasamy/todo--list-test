const express = require('express'),
  router = express.Router(),
  db = require('../../models');

const users = new db.User();

router.post('/login', (req, res, next) => {
  users.loginValidator(req.body).then(user => {
    res.status(200).json({
      success: true,
      message: 'Loged In successfully',
      user,
    });
  }).catch(err => next(err, req, res, next));
});

module.exports = router;