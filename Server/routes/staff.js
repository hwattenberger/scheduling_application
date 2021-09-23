const express = require('express');
const router = express.Router();
const staffs = require('../controllers/staffs');

const multer = require('multer');
const {storage} = require('../addons/cloudinary');
const upload = multer({storage});

router.route('/')
    .get(staffs.getAllStaff)

router.route('/:staffId')
    .get(staffs.getStaffMember)
    .put(upload.single('profilePhoto'), staffs.putStaffMember)

router.route('/:staffId/upcomingShifts')
    .get(staffs.getUpcomingShifts)

router.route('/:staffId/available')
    .get(staffs.getUserAvailability)
    .put(staffs.putUserAvailability)

router.route('/:staffId/timeoff')
    .get(staffs.getUserTimeoff)
    .post(staffs.postUserTimeoff)

module.exports = router;