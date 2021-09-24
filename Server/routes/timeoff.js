const express = require('express');
const router = express.Router();
const timeoff = require('../controllers/timeoff');
const {isLoggedIn} = require('../middleware/index');

router.route('/:timeOffId')
    .delete(isLoggedIn, timeoff.deleteTimeoff)

module.exports = router;