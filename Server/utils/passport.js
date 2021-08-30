const passport = require("passport");

passport.serializeUser(function(user, done) {
  console.log("Serialize", user);
  done(null, user);
});
  

//CHANGE THIS SHOULD ONLY STORE ID
passport.deserializeUser(function(user, done) {
  console.log("Deserialize", user);
  done(null, user);
});
