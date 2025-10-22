const express = require("express");
const router = express.Router();
const vehiculoController = require("../controllers/vehiculoController");

// Crear un nuevo vehículo
router.post("/", vehiculoController.createVehiculo);

// Obtener todos los vehículos
router.get("/", vehiculoController.getAllVehiculos);

// Obtener un vehículo por ID
router.get("/:id", vehiculoController.getVehiculoById);

// Actualizar un vehículo
router.put("/:id", vehiculoController.updateVehiculo);

// Eliminar un vehículo
router.delete("/:id", vehiculoController.deleteVehiculo);

module.exports = router;
