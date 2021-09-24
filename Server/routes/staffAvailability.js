const express = require('express');
const router = express.Router();
const staffAvailability = require('../controllers/staffAvailability');
const {isAdmin} = require('../middleware/index');

router.route('/')
    .get(isAdmin, staffAvailability.getStaffAvailabilityForWeek)

module.exports = router;