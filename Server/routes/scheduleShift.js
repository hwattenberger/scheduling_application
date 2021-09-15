const express = require('express');
const router = express.Router();
const scheduleShifts = require('../controllers/scheduleShifts');

router.route('/:schedShiftId')
    .put(scheduleShifts.updateShift)

module.exports = router;