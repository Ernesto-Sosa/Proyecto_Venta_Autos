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
    vehiculo_marca: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vehiculo_modelo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado_venta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "venta",
    timestamps: true,
    paranoid: true,
})

module.exports = Venta;
