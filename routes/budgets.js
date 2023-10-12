const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Budget = require("../models/budget");

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err ) {
      console.log(err);
      console.log(req.body)
      return res.status(401).json({ message: "Acceso no autorizado + Error: " + err, result: req.body });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/new", authenticateJWT, async (req, res) => {
  try {

    const {
      name,
      total,
      user,
      date,
      type
    } = req.body;

    let amount = 0;

    const budget = new Budget({
        name,
        total,
        date,
        type,
        amount,
        user,
    });

    await budget.save();

    return res
      .status(201)
      .json({ message: "Budget created", budget });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error" });
  }
});

router.get("/list/:userId", authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.userId;
    const budgets = await Budget.find({ user: userId });

    return res.status(200).json(budgets);
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ message: "Error" });
  }
});

router.delete("/delete/:categoryId", authenticateJWT, async (req, res) => {
    try {
      const budgetId = req.params.categoryId;
  
      // Find the category by its _id and user
      const budget = await Budget.findOne({ _id: categoryId, user: req.user._id });
  
      if (!budget) {
        return res.status(404).json({ message: "La categoria no pudo ser encontrada" });
      }
  
      await budget.remove();
  
      return res.status(200).json({ message: "La categoria fue eliminada de manera exitosa" });
    } catch (error) {
      console.error("Erro al intenter elminar la categoria por id:", error);
      return res.status(500).json({ message: "Hubo un error al tratar de eliminar la categoria" });
    }
  });

module.exports = router;
