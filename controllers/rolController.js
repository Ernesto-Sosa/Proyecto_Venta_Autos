const Rol = require("../models/rol");

// Crear un nuevo rol
exports.createRol = async (req, res) => {
  try {
    const { nombre_rol, descripcion } = req.body;
    const rol = await Rol.create({ nombre_rol, descripcion });
    res.status(201).json({ message: "Rol creado exitosamente", rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un rol por ID
exports.getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un rol
exports.updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    await rol.update({ nombre_rol, descripcion });
    res.status(200).json({ message: "Rol actualizado exitosamente", rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un rol
exports.deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    await rol.destroy();
    res.status(200).json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
