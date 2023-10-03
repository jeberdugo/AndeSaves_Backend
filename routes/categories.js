const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Category = require("../models/category");

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
      name,
      user,
    } = req.body;

    const category = new Category({
        name,
        user,
    });

    await req.user.save();
    await category.save();

    return res
      .status(201)
      .json({ message: "Categoria creada exitosamente", category });
  } catch (error) {
    console.error("Error al crear la categoria:", error);
    return res.status(500).json({ message: "Hubo un error al crear la categoria" });
  }
});

router.get("/list/:userId", authenticateJWT, async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }
    const userId = req.params.userId;
    const categories = await Category.find({ user: userId });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error al obtener las etiquetas por ID de usuario:", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener las etiquetas" });
  }
});

router.delete("/delete/:categoryId", authenticateJWT, async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
  
      // Find the category by its _id and user
      const category = await Category.findOne({ _id: categoryId, user: req.user._id });
  
      if (!category) {
        return res.status(404).json({ message: "La categoria no pudo ser encontrada" });
      }
  
      await category.remove();
  
      return res.status(200).json({ message: "La categoria fue eliminada de manera exitosa" });
    } catch (error) {
      console.error("Erro al intenter elminar la categoria por id:", error);
      return res.status(500).json({ message: "Hubo un error al tratar de eliminar la categoria" });
    }
  });

module.exports = router;
