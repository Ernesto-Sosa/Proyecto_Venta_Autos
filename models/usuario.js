const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Vehiculo = require("./vehiculo");
const Cita_Prueba_Manejo= require("./cita_prueba_manejo");
const Venta = require("./venta");

const Usuario = sequelize.define("usuario", {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "usuarios",
    timestamps: true,
    paranoid: true,
})

Usuario.hasMany(Vehiculo, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Usuario.hasMany(Cita_Prueba_Manejo, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Usuario.hasMany(Venta, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Vehiculo.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Cita_Prueba_Manejo.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Venta.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });


module.exports = Usuario;