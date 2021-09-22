const express = require('express');
const passport = require('passport');
const router = express.Router();
const auths = require('../controllers/auths');


// router.route('/login')
//   .post(passport.authenticate('local'), auths.login)

router.route('/login')
  .post(auths.authenticate, auths.login)

router.route('/logout')
  .get(auths.logout)

router.route('/google')
  .get(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.route('/google/callback')
  .get(passport.authenticate('google', { failureRedirect: '/auth/google' }), auths.googleCallback);

router.route('/register')
  .post(auths.localSignup);

router.route('/getUser')
  .get(auths.getUser);

module.exports = router;