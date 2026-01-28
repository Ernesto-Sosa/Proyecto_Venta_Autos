const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

router.post("/login", async (req, res, next) => {
  try {
    const { email, contraseña } = req.body;
    const result = await authController.login(email, contraseña);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const me = await authController.me(req.user);
    res.json(me);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
