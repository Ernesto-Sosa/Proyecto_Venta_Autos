const Usuario = require("../models/usuario");

exports.createUsuario = async (datos) => {
  const usuario = await Usuario.create(datos);
  return usuario;
};

exports.getAllUsuarios = async () => {
  const usuarios = await Usuario.findAll();
  return usuarios;
};

exports.getUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id);
  return usuario;
};

exports.updateUsuario = async (id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    await usuario.update(datos);
  }
  return usuario;
};

exports.deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    await usuario.destroy();
  }
  return usuario;
};
