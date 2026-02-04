const { Op, fn, col, literal } = require('sequelize');
const SessionLog = require('../models/session_log');
const Usuario = require('../models/usuario');
const Venta = require('../models/venta');

exports.sessionLogin = async ({ usuario_id, ip, user_agent }) => {
  return await SessionLog.create({ usuario_id, ip, user_agent, login_at: new Date() });
};

exports.sessionLogout = async (usuario_id) => {
  const open = await SessionLog.findOne({
    where: { usuario_id, logout_at: { [Op.is]: null } },
    order: [['login_at', 'DESC']],
  });
  if (!open) return null;
  open.logout_at = new Date();
  await open.save();
  return open;
};

exports.getRecentSessions = async (limit = 100) => {
  const rows = await SessionLog.findAll({
    limit,
    order: [['login_at', 'DESC']],
    include: [{ model: Usuario, as: 'usuario', attributes: ['usuario_id', 'nombre', 'apellido', 'email'] }]
  });
  return rows;
};

exports.getLoginCountsByUser = async () => {
  const rows = await SessionLog.findAll({
    attributes: [
      'usuario_id',
      [fn('COUNT', col('session_log.id')), 'logins'],
      [fn('MAX', col('session_log.login_at')), 'last_login'],
    ],
    include: [{ model: Usuario, as: 'usuario', attributes: ['usuario_id', 'nombre', 'apellido', 'email'] }],
    group: [
      'session_log.usuario_id',
      'usuario.usuario_id',
      'usuario.nombre',
      'usuario.apellido',
      'usuario.email',
    ],
    order: [[literal('logins'), 'DESC']],
  });
  return rows;
};

exports.getSalesSummary = async () => {
  const total = await Venta.count();
  const byUser = await Venta.findAll({
    attributes: ['usuario_id', [fn('COUNT', col('venta_id')), 'ventas']],
    group: ['usuario_id'],
  });
  return { total, byUser };
};

exports.getRecentSales = async (limit = 50) => {
  const rows = await Venta.findAll({
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['venta_id', 'fecha', 'precio_final', 'usuario_id', 'vehiculo_id', 'vehiculo_marca', 'vehiculo_modelo', 'createdAt'],
    include: [{ model: Usuario, attributes: ['usuario_id', 'nombre', 'apellido', 'email'] }],
  });
  return rows;
};
