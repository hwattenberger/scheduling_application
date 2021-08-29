const express = require('express');
const passport = require('passport');
const router = express.Router();
const auths = require('../controllers/auths');

router.route('/login')
  .get(auths.login)

router.route('/logout')
  .get(auths.logout)

router.route('/google')
  .get(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.route('/google/callback')
  .get(passport.authenticate('google', { failureRedirect: '/auth/google' }), auths.googleCallback);

// router.route('/local/signup')
//   .post(auths.localSignup);

module.exports = router;