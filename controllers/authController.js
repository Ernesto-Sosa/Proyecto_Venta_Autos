const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const bcrypt = require("bcryptjs");
const AppError = require("../error/appError");
const { signToken } = require("../middlewares/auth");

exports.login = async (email, contraseña) => {
  if (!email || !contraseña) {
    throw new AppError("Email y contraseña son requeridos", 400);
  }

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!isMatch) {
    throw new AppError("Credenciales inválidas", 401);
  }

  let nombre_rol = undefined;
  if (usuario.rol_id) {
    const rol = await Rol.findByPk(usuario.rol_id);
    nombre_rol = rol ? rol.nombre_rol : undefined;
  }

  const token = signToken({ usuario_id: usuario.usuario_id, email: usuario.email, rol_id: usuario.rol_id, nombre_rol });

  const { contraseña: _, ...usuarioData } = usuario.toJSON();
  return { token, usuario: { ...usuarioData, nombre_rol } };
};

exports.me = async (userPayload) => {
  if (!userPayload || !userPayload.usuario_id) {
    throw new AppError("No autenticado", 401);
  }
  const usuario = await Usuario.findByPk(userPayload.usuario_id);
  if (!usuario) throw new AppError("Usuario no encontrado", 404);

  let nombre_rol = undefined;
  if (usuario.rol_id) {
    const rol = await Rol.findByPk(usuario.rol_id);
    nombre_rol = rol ? rol.nombre_rol : undefined;
  }

  const { contraseña: _, ...usuarioData } = usuario.toJSON();
  return { ...usuarioData, nombre_rol };
};
