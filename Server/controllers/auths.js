const User = require('../models/user');
const express = require('express');
const passport = require('passport');
const bcrypt = require("bcryptjs");

module.exports.login = (req, res) => {
  console.log("LOGIN", req.body);
  //Todo: Should add some validation probably

  const authenticate = passport.authenticate('local', (err, token, userData) => {
    console.log("Yo")
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message = "Could not process login"
      })
    }
  
    return res.json({
      success: true,
      message: "You have successfully logged in",
      token,
      user: userData
    });
  })
}

// module.exports.login = (req, res) => {
//   console.log("LOGIN", req.body);
//   //Todo: Should add some validation probably

//   const authenticate = passport.authenticate('local', (err, token, userData) => {
//     console.log("Yo")
//     if (err) {
//       return res.status(400).json({
//         success: false,
//         message: err.message = "Could not process login"
//       })
//     }
  
//     return res.json({
//       success: true,
//       message: "You have successfully logged in",
//       token,
//       user: userData
//     });
//   })
// }

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports.getUser = (req, res) => {
  res.send(req.user);
}

module.exports.googleCallback = (req, res) => {
    res.redirect('http://localhost:3000');
}

module.exports.localSignup = async (req, res) => {
    const { email, password } = req.body;

    // console.log("Register", email, password, req.body.body)

    const currentUser = await User.getUserByEmail(email);
    if(currentUser) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
  
    try {
      const newUser = await User.addLocalUser({
        email,
        password: hashedPassword
      })

      return res.json({
        success: true,
        message: "You have successfully registered",
        user: newUser
      });
    } catch (e) {
    //   req.flash("error", "Error creating a new account. Try a different login method.");
      return res.status(400).json({
        success: false,
        message: "Could not process registration"
      })
    }

  }

  