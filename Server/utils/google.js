const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK_SERVER}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const id = profile.id;

        const currentUser = await User.getUserByEmail(email);

        console.log("currentUser", currentUser);

        if (!currentUser) {
            const newUser = await User.addGoogleUser({
              id,
              email,
              firstName,
              lastName
            })
            return done(null, newUser);
        }

        if (currentUser.source != "google") {
            return done(null, false, { message: `You have previously signed up with a different signin method` });
          }

        currentUser.lastVisited = new Date();
        return done(null, currentUser);
  }
));
