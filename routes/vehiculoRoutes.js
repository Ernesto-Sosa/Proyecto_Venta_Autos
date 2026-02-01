const express = require("express");
const router = express.Router();
const vehiculoController = require("../controllers/vehiculoController");
const AppError = require("../error/appError");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer para subir imágenes de vehículos
const uploadDir = path.join(__dirname, "..", "uploads", "vehiculos");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new AppError("Solo se permiten archivos de imagen", 400));
};
const upload = multer({ storage, fileFilter });

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
router.post("/", upload.single('foto'), async (req, res, next) => {
  try {
    const { marca, modelo, precio, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    const año = req.body['año'] ?? req.body['anio'] ?? req.body['aÃ±o'] ?? req.body['ano'];
    const isMissing = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    const precioNum = typeof precio === 'number' ? precio : parseInt(precio, 10);
    const usuarioIdNum = typeof usuario_id === 'number' ? usuario_id : parseInt(usuario_id, 10);
    const missing = [];
    if (isMissing(marca)) missing.push('marca');
    if (isMissing(modelo)) missing.push('modelo');
    if (Number.isNaN(precioNum)) missing.push('precio');
    if (isMissing(año)) missing.push('año');
    if (isMissing(kilometraje)) missing.push('kilometraje');
    if (isMissing(color)) missing.push('color');
    if (isMissing(tipo_combustible)) missing.push('tipo_combustible');
    if (isMissing(descripcion)) missing.push('descripcion');
    if (isMissing(estado)) missing.push('estado');
    if (Number.isNaN(usuarioIdNum)) missing.push('usuario_id');
    if (missing.length) {
      throw new AppError(`Faltan campos requeridos: ${missing.join(', ')}`, 400);
    }
    const foto_url = req.file ? `/uploads/vehiculos/${req.file.filename}` : undefined;
    const vehiculo = await vehiculoController.createVehiculo({ marca, modelo, precio: precioNum, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id: usuarioIdNum, foto_url });
    res.status(201).json({ message: "Vehículo creado exitosamente", vehiculo });
  } catch (err) {
    next(err);
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
router.get("/", async (req, res, next) => {
  try {
    const vehiculos = await vehiculoController.getAllVehiculos();
    res.status(200).json(vehiculos);
  } catch (err) {
    next(err);
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
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de vehículo inválido", 400);
    }
    
    const vehiculo = await vehiculoController.getVehiculoById(id);
    
    if (!vehiculo) {
      throw new AppError(`Vehículo con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json(vehiculo);
  } catch (err) {
    next(err);
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
router.put("/:id", upload.single('foto'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marca, modelo, precio, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    const año = req.body['año'] ?? req.body['anio'] ?? req.body['aÃ±o'] ?? req.body['ano'];
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de vehículo inválido", 400);
    }
    const isMissing = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    const precioNum = typeof precio === 'number' ? precio : (precio !== undefined ? parseInt(precio, 10) : undefined);
    const usuarioIdNum = typeof usuario_id === 'number' ? usuario_id : (usuario_id !== undefined ? parseInt(usuario_id, 10) : undefined);
    const foto_url = req.file ? `/uploads/vehiculos/${req.file.filename}` : undefined;
    const payload = { marca, modelo, año, kilometraje, color, tipo_combustible, descripcion, estado };
    if (precioNum !== undefined && !Number.isNaN(precioNum)) payload.precio = precioNum;
    if (usuarioIdNum !== undefined && !Number.isNaN(usuarioIdNum)) payload.usuario_id = usuarioIdNum;
    if (foto_url) payload.foto_url = foto_url;
    const vehiculo = await vehiculoController.updateVehiculo(id, payload);
    
    if (!vehiculo) {
      throw new AppError(`Vehículo con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Vehículo actualizado exitosamente", vehiculo });
  } catch (err) {
    next(err);
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
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de vehículo inválido", 400);
    }
    
    const vehiculo = await vehiculoController.deleteVehiculo(id);
    
    if (!vehiculo) {
      throw new AppError(`Vehículo con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Vehículo eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
