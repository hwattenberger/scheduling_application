const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require("bcryptjs")

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function(email, password, done) {
    console.log("Do I get here");
    const currentUser = await User.getUserByEmail(email);

    console.log("currentUser", currentUser);

    if (!currentUser) {
      return done(null, false, { message: `User with email ${email} does not exist`});
    }

    if (currentUser.source != "local") {
      return done(null, false, { message: `You have previously signed up with a different signin method` });
    }

    if(!bcrypt.compareSync(password, currentUser.password)) {
      return done(null, false, { message: 'Invalid username or password'});
    }

    //success
    currentUser.lastVisited = new Date();
    return done(null, currentUser);
  }
));
