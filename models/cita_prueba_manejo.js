const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Cita_Prueba_Manejo = sequelize.define("cita_prueba_manejo", {
    cita_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha_cita: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hora_cita: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    notas: {
        type: DataTypes.STRING,
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
}, {
    tableName: "prueba_cita_manejos",
    timestamps: true,
    paranoid: true,
})

module.exports = Cita_Prueba_Manejo;