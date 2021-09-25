const express = require('express');
const router = express.Router();
const staffs = require('../controllers/staffs');

const multer = require('multer');
const {storage} = require('../addons/cloudinary');
const upload = multer({storage});

const {isLoggedIn, isAdmin} = require('../middleware/index');

router.route('/')
    .get(isAdmin, staffs.getAllStaff)

router.route('/:staffId')
    .get(isLoggedIn, staffs.getStaffMember)
    .put(isLoggedIn, staffs.putStaffMember)

router.route('/:staffId/photo')
    .put(isLoggedIn, upload.single('profilePhoto'), staffs.putStaffMemberWImage)

router.route('/:staffId/upcomingShifts')
    .get(isLoggedIn, staffs.getUpcomingShifts)

router.route('/:staffId/available')
    .get(isLoggedIn, staffs.getUserAvailability)
    .put(isLoggedIn, staffs.putUserAvailability)

router.route('/:staffId/timeoff')
    .get(isLoggedIn, staffs.getUserTimeoff)
    .post(isLoggedIn, staffs.postUserTimeoff)

module.exports = router;