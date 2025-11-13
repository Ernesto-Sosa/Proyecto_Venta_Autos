const express = require("express");
const router = express.Router();
const rolController = require("../controllers/rolController");
const AppError = require("../error/appError");

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       required:
 *         - nombre_rol
 *         - descripcion
 *       properties:
 *         rol_id:
 *           type: integer
 *           description: ID único del rol
 *         nombre_rol:
 *           type: string
 *           description: Nombre del rol
 *         descripcion:
 *           type: string
 *           description: Descripción del rol
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error al crear el rol
 */
router.post("/", async (req, res, next) => {
  try {
    const { nombre_rol, descripcion } = req.body;
    
    if (!nombre_rol || !descripcion) {
      throw new AppError("Faltan campos requeridos: nombre_rol y descripcion", 400);
    }
    
    // Verificar si ya existe un rol con ese nombre
    const roles = await rolController.getAllRoles();
    const rolExistente = roles.find(r => r.nombre_rol.toLowerCase() === nombre_rol.toLowerCase());
    
    if (rolExistente) {
      throw new AppError(`Ya existe un rol con el nombre '${nombre_rol}'`, 400);
    }
    
    const rol = await rolController.createRol({ nombre_rol, descripcion });
    res.status(201).json(rol);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de todos los roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error al obtener los roles
 */
router.get("/", async (req, res, next) => {
  try {
    const roles = await rolController.getAllRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al obtener el rol
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de rol inválido", 400);
    }
    
    const rol = await rolController.getRolById(id);
    
    if (!rol) {
      throw new AppError(`Rol con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json(rol);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al actualizar el rol
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de rol inválido", 400);
    }
    
    const rol = await rolController.updateRol(id, { nombre_rol, descripcion });
    
    if (!rol) {
      throw new AppError(`Rol con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Rol actualizado exitosamente", rol });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al actualizar el rol
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de rol inválido", 400);
    }
    
    const rol = await rolController.updateRol(id, { nombre_rol, descripcion });
    
    if (!rol) {
      throw new AppError(`Rol con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json(rol);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al eliminar el rol
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de rol inválido", 400);
    }
    
    const rol = await rolController.deleteRol(id);
    
    if (!rol) {
      throw new AppError(`Rol con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Rol eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
