const express = require('express');
const router = express.Router();
const shiftTypes = require('../controllers/shiftTypes');

router.route('/')
    .get(shiftTypes.getShiftTypes)
    .post(shiftTypes.postShiftTypes)

router.route('/:shiftId')
    .put(shiftTypes.putShiftTypes)

module.exports = router;