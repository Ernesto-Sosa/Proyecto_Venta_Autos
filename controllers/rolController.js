const Rol = require("../models/rol");

exports.createRol = async (datos) => {
  const rol = await Rol.create(datos);
  return rol;
};

exports.getAllRoles = async () => {
  const roles = await Rol.findAll();
  return roles;
};

exports.getRolById = async (id) => {
  const rol = await Rol.findByPk(id);
  return rol;
};

exports.updateRol = async (id, datos) => {
  const rol = await Rol.findByPk(id);
  if (rol) {
    await rol.update(datos);
  }
  return rol;
};

exports.deleteRol = async (id) => {
  const rol = await Rol.findByPk(id);
  if (rol) {
    await rol.destroy();
  }
  return rol;
};
