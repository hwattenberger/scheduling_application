const express = require('express');
const router = express.Router();
const staffAvailability = require('../controllers/staffAvailability');

router.route('/')
    .get(staffAvailability.getStaffAvailabilityForWeek)

module.exports = router;