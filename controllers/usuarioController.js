const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

exports.createUsuario = async (datos) => {
  const payload = { ...datos };
  if (payload.contraseña) {
    const salt = await bcrypt.genSalt(10);
    payload.contraseña = await bcrypt.hash(payload.contraseña, salt);
  }
  const usuario = await Usuario.create(payload);
  const plain = usuario.toJSON();
  delete plain.contraseña;
  return plain;
};

exports.getAllUsuarios = async () => {
  const usuarios = await Usuario.findAll({ attributes: { exclude: ["contraseña"] } });
  return usuarios;
};

exports.getUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ["contraseña"] } });
  return usuario;
};

exports.updateUsuario = async (id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    const updateData = { ...datos };
    if (updateData.contraseña) {
      const salt = await bcrypt.genSalt(10);
      updateData.contraseña = await bcrypt.hash(updateData.contraseña, salt);
    }
    await usuario.update(updateData);
  }
  if (!usuario) return usuario;
  const plain = usuario.toJSON();
  delete plain.contraseña;
  return plain;
};

exports.deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    await usuario.destroy();
  }
  return usuario;
};
