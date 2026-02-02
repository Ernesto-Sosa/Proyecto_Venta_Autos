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

// Verificación de 2FA después de login (si twofa_required)
router.post("/login-2fa", async (req, res, next) => {
  try {
    const { challenge, code } = req.body;
    const result = await authController.login2fa(challenge, code);
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

// Iniciar configuración de 2FA: genera secreto + QR (no guarda aún)
router.get("/2fa/setup", verifyToken, async (req, res, next) => {
  try {
    const result = await authController.setup2fa(req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Activar 2FA con código válido
router.post("/2fa/enable", verifyToken, async (req, res, next) => {
  try {
    const { secret, code } = req.body;
    const result = await authController.enable2fa(req.user, secret, code);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Desactivar 2FA
router.post("/2fa/disable", verifyToken, async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await authController.disable2fa(req.user, code);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
