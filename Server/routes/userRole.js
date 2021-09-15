const express = require('express');
const router = express.Router();
const userRoles = require('../controllers/userRoles');

router.route('/') 
    .get(userRoles.getUserRoles)
    .post(userRoles.postUserRoles)
    .delete(userRoles.deleteUserRoles)

module.exports = router;