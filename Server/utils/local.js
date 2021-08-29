const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(new LocalStrategy(
  async function(email, password, done) {
        const currentUser = await User.getUserByEmail(email);

        console.log("currentUser", currentUser);

        if (!currentUser) {
            return done(null, false, { message: `User with email ${email} does not exist`});
        }

        if (currentUser.source != "local") {
            return done(null, false, { message: `You have previously signed up with a different signin method` });
          }

        // currentUser.lastVisited = new Date();
        return done(null, currentUser);
  }
));
