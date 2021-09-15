const express = require('express');
const router = express.Router();
const staffs = require('../controllers/staffs');

router.route('/')
    .get(staffs.getAllStaff)

router.route('/:staffId')
    .get(staffs.getStaffMember)
    .put(staffs.putStaffMember)

router.route('/:staffId/upcomingShifts')
    .get(staffs.getUpcomingShifts)

router.route('/:staffId/available')
    .get(staffs.getUserAvailability)
    .put(staffs.putUserAvailability)

router.route('/:staffId/timeoff')
    .get(staffs.getUserTimeoff)
    .post(staffs.postUserTimeoff)

module.exports = router;