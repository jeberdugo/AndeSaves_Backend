const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Successful authentication, generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
        'lKa8gZ353a57jiDji1rd9XdZB1nod2FNlCYqAhB1LP4jjxnzLu9SZHTigbpBnVn',
        { expiresIn: '1h' } // Adjust the token expiration as needed
      );
  
      res.status(200).json({ token: token });
    })(req, res, next);
  });

module.exports = router;