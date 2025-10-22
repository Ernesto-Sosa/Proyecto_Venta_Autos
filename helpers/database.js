const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const databaseName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dialect = process.env.DB_DIALECT;
const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT ?? '5432', 10);

const sequelize = new Sequelize(databaseName, user, password, {
    host: host,
    dialect: dialect,
    port: port,
    logging: false,
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");})
  .catch((err) => {
    console.error("Error al conectarse a la base de datos:", err);});

module.exports = sequelize;
