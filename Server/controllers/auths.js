const User = require('../models/user');
// const express = require('express');
const passport = require('passport');
const bcrypt = require("bcryptjs");

module.exports.login = (req, res) => {
  try {
    const returnUser = req.user;
    returnUser.password = undefined;
    res.json(returnUser)
  }
  catch (error) {
    res.status(500).json({message: "ERROR", error: error.message})
  }
}

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (info) return res.status(401).json({message: info.message});

    if (!user) {
      return res.status(401).json({ message: 'Try logging in again'});
    }

    if(!user.isActive) {
      return res.status(401).json({ message: 'User is inactive'});
    }

    req.logIn(user, function(err) {
      if (err) return next(err);
      return next();
    })

    next();
  })(req, res, next);
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports.getUser = (req, res) => {
  const user = req.user;
  if(user) delete user.password
  res.send(user);
}

module.exports.googleCallback = (req, res) => {
    res.redirect(process.env.GOOGLE_CALLBACK);
}

module.exports.localSignup = async (req, res) => {
    const { email, password } = req.body;

    if(!email) {
      return res.status(400).json({
        success: false,
        message: "Must enter email address"
      });
    }

    if(!password) {
      return res.status(400).json({
        success: false,
        message: "Must enter password"
      });
    }

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

      req.logIn(newUser, function(err) {
        if (err) return next(err);
        return res.json({
          success: true,
          message: "You have successfully registered",
          user: newUser
        });
      })

    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Could not process registration"
      })
    }

  }

  