const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Expense = require("../models/expense");

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/new", authenticateJWT, async (req, res) => {
  try {

    const {
      amount,
      date,
      category,
      description,
      user,
      isRecurring,
      recurrenceType,
      recurrenceEndDate,
    } = req.body;

    const expense = new Expense({
      amount,
      date,
      category,
      description,
      user,
      isRecurring,
      recurrenceType,
      recurrenceEndDate,
    });

    req.user.balance = req.user.balance - amount;
    await req.user.save();
    await expense.save();

    return res
      .status(201)
      .json({ message: "Gasto creado exitosamente", expense });
  } catch (error) {
    console.error("Error al crear el gasto:", error);
    return res.status(500).json({ message: "Hubo un error al crear el gasto" });
  }
});

router.get("/list/:userId", authenticateJWT, async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }
    const userId = req.params.userId;
    const expenses = await Expense.find({ user: userId });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Error al obtener los gastos por ID de usuario:", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener los gastos" });
  }
});

module.exports = router;
