const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaPruebaManejController");
const AppError = require("../error/appError");

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
router.post("/", async (req, res, next) => {
  try {
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    
    if (!fecha_cita || !hora_cita || !estado || !usuario_id || !vehiculo_id) {
      throw new AppError("Faltan campos requeridos: fecha_cita, hora_cita, estado, usuario_id, vehiculo_id", 400);
    }
    
    // Verificar si ya existe una cita con las mismas características
    const citas = await citaController.getAllCitas();
    const citaExistente = citas.find(c => 
      c.fecha_cita === fecha_cita && 
      c.hora_cita === hora_cita && 
      c.vehiculo_id === vehiculo_id
    );
    
    if (citaExistente) {
      throw new AppError('Ya existe una cita para este vehículo en esa fecha y hora', 400);
    }
    
    const cita = await citaController.createCita({ fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    res.status(201).json({ message: "Cita creada exitosamente", cita });
  } catch (err) {
    next(err);
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
router.get("/", async (req, res, next) => {
  try {
    const citas = await citaController.getAllCitas();
    res.status(200).json(citas);
  } catch (err) {
    next(err);
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
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de cita inválido", 400);
    }
    
    const cita = await citaController.getCitaById(id);
    
    if (!cita) {
      throw new AppError(`Cita con ID ${id} no encontrada`, 404);
    }
    
    res.status(200).json(cita);
  } catch (err) {
    next(err);
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
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de cita inválido", 400);
    }
    
    const cita = await citaController.updateCita(id, { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    
    if (!cita) {
      throw new AppError(`Cita con ID ${id} no encontrada`, 404);
    }
    
    res.status(200).json({ message: "Cita actualizada exitosamente", cita });
  } catch (err) {
    next(err);
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
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de cita inválido", 400);
    }
    
    const cita = await citaController.deleteCita(id);
    
    if (!cita) {
      throw new AppError(`Cita con ID ${id} no encontrada`, 404);
    }
    
    res.status(200).json({ message: "Cita eliminada exitosamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
