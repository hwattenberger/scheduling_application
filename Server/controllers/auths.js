const User = require('../models/user');
const express = require('express');


module.exports.login = (req, res) => {
    res.redirect('/');
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports.googleCallback = (req, res) => {
    res.redirect('/');
}

module.exports.localSignup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body
  
    const hashedPassword = await bcrypt.hash(password, 10)
  
    try {
      await User.addLocalUser({
        id: uuid.v4(),
        email,
        firstName: first_name,
        lastName: last_name,
        password: hashedPassword
      })
    } catch (e) {
    //   req.flash("error", "Error creating a new account. Try a different login method.");
      res.redirect("/local/signup")
    }
  
    res.redirect("/local/signin")
  }

  