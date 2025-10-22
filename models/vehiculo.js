const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Venta = require ("./venta");
const Cita_Prueba_Manejo = require("./cita_prueba_manejo");

const Vehiculo = sequelize.define("vehiculo",{
    vehiculo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    año: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kilometraje: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo_combustible: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    paranoid: true,
})

Vehiculo.hasMany(Venta, {
    foreignKey: 'vehiculo_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Vehiculo.hasMany(Cita_Prueba_Manejo, {
    foreignKey: 'vehiculo_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Venta.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

Cita_Prueba_Manejo.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

module.exports = Vehiculo;