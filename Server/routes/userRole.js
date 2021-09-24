const express = require('express');
const router = express.Router();
const userRoles = require('../controllers/userRoles');
const {isLoggedIn, isAdmin} = require('../middleware/index');

router.route('/') 
    .get(isLoggedIn, userRoles.getUserRoles)
    .post(isAdmin, userRoles.postUserRoles)
    .delete(isAdmin, userRoles.deleteUserRoles)

module.exports = router;