const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const AppError = require("../error/appError");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - contraseña
 *         - telefono
 *         - rol_id
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         contraseña:
 *           type: string
 *           description: Contraseña del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario
 *         avatar_url:
 *           type: string
 *           description: URL del avatar del usuario
 *         rol_id:
 *           type: integer
 *           description: ID del rol del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error al crear el usuario
 */
router.post("/", async (req, res, next) => {
  try {
    const { nombre, apellido, email, contraseña, telefono, rol_id, avatar_url } = req.body;
    
    if (!nombre || !apellido || !email || !contraseña || !telefono || !rol_id) {
      throw new AppError("Faltan campos requeridos: nombre, apellido, email, contraseña, telefono, rol_id", 400);
    }
    
    // Verificar si ya existe un usuario con ese email
    const usuarios = await usuarioController.getAllUsuarios();
    const usuarioExistente = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (usuarioExistente) {
      throw new AppError(`Ya existe un usuario con el email '${email}'`, 400);
    }
    
    const usuario = await usuarioController.createUsuario({ nombre, apellido, email, contraseña, telefono, rol_id, avatar_url });
    res.status(201).json({ message: "Usuario creado exitosamente", usuario });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error al obtener los usuarios
 */
router.get("/", async (req, res, next) => {
  try {
    const usuarios = await usuarioController.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de usuario inválido", 400);
    }
    
    const usuario = await usuarioController.getUsuarioById(id);
    
    if (!usuario) {
      throw new AppError(`Usuario con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json(usuario);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, contraseña, telefono, rol_id, avatar_url } = req.body;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de usuario inválido", 400);
    }
    
    const usuario = await usuarioController.updateUsuario(id, { nombre, apellido, email, contraseña, telefono, rol_id, avatar_url });
    
    if (!usuario) {
      throw new AppError(`Usuario con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Usuario actualizado exitosamente", usuario });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError("ID de usuario inválido", 400);
    }
    
    const usuario = await usuarioController.deleteUsuario(id);
    
    if (!usuario) {
      throw new AppError(`Usuario con ID ${id} no encontrado`, 404);
    }
    
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// Configuración de multer para subir avatares de usuarios
const uploadDir = path.join(__dirname, "..", "uploads", "usuarios");
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
 * /api/usuarios/{id}/avatar:
 *   put:
 *     summary: Subir/actualizar avatar del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar actualizado exitosamente
 */
router.put("/:id/avatar", upload.single('avatar'), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      throw new AppError("ID de usuario inválido", 400);
    }
    const avatar_url = req.file ? `/uploads/usuarios/${req.file.filename}` : undefined;
    if (!avatar_url) {
      throw new AppError("No se recibió archivo de imagen", 400);
    }
    const usuario = await usuarioController.updateUsuario(id, { avatar_url });
    if (!usuario) {
      throw new AppError(`Usuario con ID ${id} no encontrado`, 404);
    }
    res.status(200).json({ message: "Avatar actualizado exitosamente", usuario });
  } catch (err) {
    next(err);
  }
});
