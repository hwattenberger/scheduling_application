const express = require('express');
const router = express.Router();
const scheduleWeeks = require('../controllers/scheduleWeeks');

router.route('/')
    .get(scheduleWeeks.getScheduleWeek)
    .post(scheduleWeeks.postScheduleWeek)


module.exports = router;