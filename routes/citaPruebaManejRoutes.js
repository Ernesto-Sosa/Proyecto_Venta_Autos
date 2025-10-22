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
router.post("/", citaController.createCita);

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
router.get("/", citaController.getAllCitas);

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
router.get("/:id", citaController.getCitaById);

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
router.put("/:id", citaController.updateCita);

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
router.delete("/:id", citaController.deleteCita);

module.exports = router;
