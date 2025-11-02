const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaPruebaManejController");

/**
 * @swagger
 * components:
 *   schemas:
 *     CitaPruebaManejo:
 *       type: object
 *       required:
 *         - fecha_cita
 *         - hora_cita
 *         - estado
 *         - notas
 *         - usuario_id
 *         - vehiculo_id
 *       properties:
 *         cita_id:
 *           type: integer
 *           description: ID único de la cita
 *         fecha_cita:
 *           type: string
 *           format: date
 *           description: Fecha de la cita de prueba de manejo
 *         hora_cita:
 *           type: string
 *           description: Hora de la cita de prueba de manejo
 *         estado:
 *           type: string
 *           description: Estado de la cita
 *         notas:
 *           type: string
 *           description: Notas adicionales de la cita
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que solicita la prueba
 *         vehiculo_id:
 *           type: integer
 *           description: ID del vehículo a probar
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una nueva cita de prueba de manejo
 *     tags: [Citas de Prueba de Manejo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CitaPruebaManejo'
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitaPruebaManejo'
 *       500:
 *         description: Error al crear la cita
 */
router.post("/", async (req, res) => {
  try {
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    
    if (!fecha_cita || !hora_cita || !estado || !usuario_id || !vehiculo_id) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    const cita = await citaController.createCita({ fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    res.status(201).json({ message: "Cita creada exitosamente", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener todas las citas de prueba de manejo
 *     tags: [Citas de Prueba de Manejo]
 *     responses:
 *       200:
 *         description: Lista de todas las citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CitaPruebaManejo'
 *       500:
 *         description: Error al obtener las citas
 */
router.get("/", async (req, res) => {
  try {
    const citas = await citaController.getAllCitas();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita de prueba de manejo por ID
 *     tags: [Citas de Prueba de Manejo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitaPruebaManejo'
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error al obtener la cita
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const cita = await citaController.getCitaById(id);
    
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita de prueba de manejo
 *     tags: [Citas de Prueba de Manejo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CitaPruebaManejo'
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitaPruebaManejo'
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error al actualizar la cita
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const cita = await citaController.updateCita(id, { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    
    res.status(200).json({ message: "Cita actualizada exitosamente", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Eliminar una cita de prueba de manejo
 *     tags: [Citas de Prueba de Manejo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error al eliminar la cita
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const cita = await citaController.deleteCita(id);
    
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    
    res.status(200).json({ message: "Cita eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
