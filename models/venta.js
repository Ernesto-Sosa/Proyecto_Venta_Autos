const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Venta = sequelize.define("venta", {
    venta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    precio_final: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estado_venta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    paranoid: true,
})

module.exports = Venta;
