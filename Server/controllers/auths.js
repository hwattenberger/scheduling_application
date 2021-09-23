const User = require('../models/user');
// const express = require('express');
const passport = require('passport');
const bcrypt = require("bcryptjs");

module.exports.login = (req, res) => {
  try {
    res.json({message: "Successfully logged in!"})
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
  delete user.password
  res.send(user);
}

module.exports.googleCallback = (req, res) => {
    res.redirect('http://localhost:3000');
}

module.exports.localSignup = async (req, res) => {
    const { email, password } = req.body;

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

  