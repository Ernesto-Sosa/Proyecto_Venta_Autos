const express = require('express');
const router = express.Router();
const { verifyToken, requireRoles } = require('../middlewares/auth');
const audit = require('../controllers/auditController');

router.get('/sessions/recent', verifyToken, requireRoles(['Administrador']), async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const rows = await audit.getRecentSessions(limit);
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/sessions/login-counts', verifyToken, requireRoles(['Administrador']), async (req, res, next) => {
  try {
    const rows = await audit.getLoginCountsByUser();
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/sales/summary', verifyToken, requireRoles(['Administrador']), async (req, res, next) => {
  try {
    const summary = await audit.getSalesSummary();
    res.json(summary);
  } catch (e) { next(e); }
});

router.get('/sales/recent', verifyToken, requireRoles(['Administrador']), async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const rows = await audit.getRecentSales(limit);
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
