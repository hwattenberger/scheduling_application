const express = require('express');
const router = express.Router();
const scheduleShifts = require('../controllers/scheduleShifts');
const {isLoggedIn} = require('../middleware/index');

router.route('/:schedShiftId')
    .put(isLoggedIn, scheduleShifts.updateShift)

module.exports = router;