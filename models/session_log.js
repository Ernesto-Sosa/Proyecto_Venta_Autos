const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/database');
const Usuario = require('./usuario');

const SessionLog = sequelize.define('session_log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  login_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  logout_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'session_log',
  timestamps: true,
  paranoid: false,
});

SessionLog.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = SessionLog;
