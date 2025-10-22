const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Venta:
 *       type: object
 *       required:
 *         - fecha
 *         - precio_final
 *         - usuario_id
 *         - vehiculo_id
 *         - estado_venta
 *       properties:
 *         venta_id:
 *           type: integer
 *           description: ID único de la venta
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha de la venta
 *         precio_final:
 *           type: integer
 *           description: Precio final de la venta
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realiza la venta
 *         vehiculo_id:
 *           type: integer
 *           description: ID del vehículo vendido
 *         estado_venta:
 *           type: string
 *           description: Estado de la venta
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       500:
 *         description: Error al crear la venta
 */
router.post("/", ventaController.createVenta);

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de todas las ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *       500:
 *         description: Error al obtener las ventas
 */
router.get("/", ventaController.getAllVentas);

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error al obtener la venta
 */
router.get("/:id", ventaController.getVentaById);

/**
 * @swagger
 * /api/ventas/{id}:
 *   put:
 *     summary: Actualizar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error al actualizar la venta
 */
router.put("/:id", ventaController.updateVenta);

/**
 * @swagger
 * /api/ventas/{id}:
 *   delete:
 *     summary: Eliminar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error al eliminar la venta
 */
router.delete("/:id", ventaController.deleteVenta);

module.exports = router;
