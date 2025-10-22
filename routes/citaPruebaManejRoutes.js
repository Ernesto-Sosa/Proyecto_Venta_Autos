const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaPruebaManejController");

// Crear una nueva cita
router.post("/", citaController.createCita);

// Obtener todas las citas
router.get("/", citaController.getAllCitas);

// Obtener una cita por ID
router.get("/:id", citaController.getCitaById);

// Actualizar una cita
router.put("/:id", citaController.updateCita);

// Eliminar una cita
router.delete("/:id", citaController.deleteCita);

module.exports = router;
