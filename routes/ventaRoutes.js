const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");

// Crear una nueva venta
router.post("/", ventaController.createVenta);

// Obtener todas las ventas
router.get("/", ventaController.getAllVentas);

// Obtener una venta por ID
router.get("/:id", ventaController.getVentaById);

// Actualizar una venta
router.put("/:id", ventaController.updateVenta);

// Eliminar una venta
router.delete("/:id", ventaController.deleteVenta);

module.exports = router;
