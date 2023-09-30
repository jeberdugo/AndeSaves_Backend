const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport")
const User = require('../models/user'); 

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get('/balance', authenticateJWT, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const balance = user.balance;

    res.status(200).json({ balance: balance });
  } catch (error) {
    console.error('Error al obtener el balance del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;