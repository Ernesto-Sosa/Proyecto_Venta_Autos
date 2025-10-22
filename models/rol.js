const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Usuario = require("./usuario");

const Rol = sequelize.define("rol", {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    paranoid: true,
})

Rol.hasMany(Usuario, {
    foreignKey: 'rol_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Usuario.belongsTo(Rol, {
    foreignKey: 'rol_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

module.exports = Rol;
