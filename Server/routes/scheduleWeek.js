const express = require('express');
const router = express.Router();
const scheduleWeeks = require('../controllers/scheduleWeeks');
const {isLoggedIn, isAdmin} = require('../middleware/index');

router.route('/')
    .get(isLoggedIn, scheduleWeeks.getScheduleWeek)
    .post(isAdmin, scheduleWeeks.postScheduleWeek)

router.route('/copy')
    .post(isAdmin, scheduleWeeks.copyPreviousWeek)

module.exports = router;