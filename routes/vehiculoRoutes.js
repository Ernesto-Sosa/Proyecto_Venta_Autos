const express = require("express");
const router = express.Router();
const vehiculoController = require("../controllers/vehiculoController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       required:
 *         - marca
 *         - modelo
 *         - precio
 *         - año
 *         - kilometraje
 *         - color
 *         - tipo_combustible
 *         - descripcion
 *         - estado
 *         - usuario_id
 *       properties:
 *         vehiculo_id:
 *           type: integer
 *           description: ID único del vehículo
 *         marca:
 *           type: string
 *           description: Marca del vehículo
 *         modelo:
 *           type: string
 *           description: Modelo del vehículo
 *         precio:
 *           type: integer
 *           description: Precio del vehículo
 *         año:
 *           type: string
 *           description: Año del vehículo
 *         kilometraje:
 *           type: string
 *           description: Kilometraje del vehículo
 *         color:
 *           type: string
 *           description: Color del vehículo
 *         tipo_combustible:
 *           type: string
 *           description: Tipo de combustible del vehículo
 *         descripcion:
 *           type: string
 *           description: Descripción del vehículo
 *         estado:
 *           type: string
 *           description: Estado del vehículo
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario propietario
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al crear el vehículo
 */
router.post("/", async (req, res) => {
  try {
    const { marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    
    if (!marca || !modelo || !precio || !año || !kilometraje || !color || !tipo_combustible || !descripcion || !estado || !usuario_id) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    const vehiculo = await vehiculoController.createVehiculo({ marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id });
    res.status(201).json({ message: "Vehículo creado exitosamente", vehiculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Lista de todos los vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al obtener los vehículos
 */
router.get("/", async (req, res) => {
  try {
    const vehiculos = await vehiculoController.getAllVehiculos();
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error al obtener el vehículo
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const vehiculo = await vehiculoController.getVehiculoById(id);
    
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    
    res.status(200).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error al actualizar el vehículo
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const vehiculo = await vehiculoController.updateVehiculo(id, { marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id });
    
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    
    res.status(200).json({ message: "Vehículo actualizado exitosamente", vehiculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error al eliminar el vehículo
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const vehiculo = await vehiculoController.deleteVehiculo(id);
    
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    
    res.status(200).json({ message: "Vehículo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
