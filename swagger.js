const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Venta de Autos",
      version: "1.0.0",
      description: "API para gestionar la venta de automóviles con usuarios, vehículos, roles, ventas y citas de prueba de manejo",
      contact: {
        name: "Ernesto Sosa",
        email: "sosaernesto232@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
