const express = require('express'),
    router = express.Router(),
    db = require('../../models');

const task = new db.Task();

router.post('/', (req, res, next) => {
    task.createTask(req.body, req.user).then(task => {
        res.status(201).json({
            success: true,
            ...task,
        });
    }).catch(err => next(err, req, res, next));
});

router.get('/', (req, res, next) => {
    task.getTask(req.user).then(tasks => {
        res.status(200).json({
            success: true,
            tasks,
        });
    }).catch(err => next(err, req, res, next));
});

router.get('/:id', (req, res, next) => {
    task.getTask(req.user, req.params.id).then(tasks => {
        res.status(200).json({
            success: true,
            ...tasks,
        });
    }).catch(err => next(err, req, res, next));
});

module.exports = router;