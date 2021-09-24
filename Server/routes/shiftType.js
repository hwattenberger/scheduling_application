const express = require('express');
const router = express.Router();
const shiftTypes = require('../controllers/shiftTypes');
const {isLoggedIn, isAdmin} = require('../middleware/index');

router.route('/')
    .get(isLoggedIn, shiftTypes.getShiftTypes)
    .post(isAdmin, shiftTypes.postShiftTypes)

router.route('/:shiftId')
    .put(isLoggedIn, shiftTypes.putShiftTypes)

module.exports = router;