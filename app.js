const sequelize = require("./helpers/database.js"); 
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.js");
require ("dotenv").config();
const cors = require("cors");

const Usuario = require("./models/usuario.js");
const Vehiculo = require("./models/vehiculo.js");
const Rol = require("./models/rol.js");
const Venta = require("./models/venta.js");
const Cita_Prueba_Manejo = require("./models/cita_prueba_manejo.js");

// Importar rutas
const rolRoutes = require("./routes/rolRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const vehiculoRoutes = require("./routes/vehiculoRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
const citaPruebaManejRoutes = require("./routes/citaPruebaManejRoutes");

const app = express();

// Configuracion de Cors
const allowedOrigins = ["http://localhost:3000"];
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api/roles", rolRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/vehiculos", vehiculoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/citas", citaPruebaManejRoutes);

sequelize
 .sync({ alter: true })
 .then(() => {
 console.log("Todos los modelos se sincronizaron correctamente.");
 }) .catch((err) => {
 console.log("Ha ocurrido un error al sincronizar los modelos: ", err); 
});

app.listen(3000, () => {
 console.log("Servidor iniciado en el puerto 3000");
 console.log("Swagger disponible en http://localhost:3000/api-docs");
});
