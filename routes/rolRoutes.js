const express = require("express");
const router = express.Router();
const rolController = require("../controllers/rolController");

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
router.post("/", async (req, res) => {
  try {
    const { nombre_rol, descripcion } = req.body;
    
    if (!nombre_rol || !descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    const rol = await rolController.createRol({ nombre_rol, descripcion });
    res.status(201).json({ message: "Rol creado exitosamente", rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.get("/", async (req, res) => {
  try {
    const roles = await rolController.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const rol = await rolController.getRolById(id);
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const rol = await rolController.updateRol(id, { nombre_rol, descripcion });
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    res.status(200).json({ message: "Rol actualizado exitosamente", rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const rol = await rolController.deleteRol(id);
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    res.status(200).json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
