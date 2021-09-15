const express = require('express');
const router = express.Router();
const timeoff = require('../controllers/timeoff');

router.route('/:timeOffId')
    .delete(timeoff.deleteTimeoff)

module.exports = router;