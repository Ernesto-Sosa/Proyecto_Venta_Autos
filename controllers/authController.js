const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const bcrypt = require("bcryptjs");
const AppError = require("../error/appError");
const { signToken } = require("../middlewares/auth");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

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

  // Si el usuario tiene 2FA habilitado, devolvemos un desafío de 2FA en lugar del token final
  if (usuario.twofa_enabled) {
    const challenge = signToken({ type: '2fa', usuario_id: usuario.usuario_id }, { expiresIn: '5m' });
    const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
    return { twofa_required: true, challenge, usuario: { ...usuarioData, nombre_rol } };
  }

  const token = signToken({ usuario_id: usuario.usuario_id, email: usuario.email, rol_id: usuario.rol_id, nombre_rol });

  const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
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

  const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
  return { ...usuarioData, nombre_rol };
};

// Verificar 2FA después del login (desafío)
exports.login2fa = async (challenge, code) => {
  if (!challenge || !code) throw new AppError('Datos incompletos', 400);
  const tokenCode = String(code).replace(/\D/g, '');
  let payload;
  try {
    payload = jwt.verify(challenge, JWT_SECRET);
  } catch (e) {
    throw new AppError('Desafío inválido o expirado', 401);
  }
  if (payload.type !== '2fa' || !payload.usuario_id) throw new AppError('Desafío inválido', 400);

  const usuario = await Usuario.findByPk(payload.usuario_id);
  if (!usuario || !usuario.twofa_enabled || !usuario.twofa_secret) throw new AppError('2FA no habilitado', 400);

  const storedSecret = String(usuario.twofa_secret).replace(/\s/g, '').toUpperCase();
  const verified = speakeasy.totp.verify({ secret: storedSecret, encoding: 'base32', token: tokenCode, window: 3, digits: 6, step: 30 });
  if (!verified) throw new AppError('Código 2FA inválido', 401);

  let nombre_rol = undefined;
  if (usuario.rol_id) {
    const rol = await Rol.findByPk(usuario.rol_id);
    nombre_rol = rol ? rol.nombre_rol : undefined;
  }
  const token = signToken({ usuario_id: usuario.usuario_id, email: usuario.email, rol_id: usuario.rol_id, nombre_rol });
  const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
  return { token, usuario: { ...usuarioData, nombre_rol } };
};

// Generar secreto y QR para configurar 2FA (no guarda nada aún)
exports.setup2fa = async (userPayload) => {
  if (!userPayload || !userPayload.usuario_id) throw new AppError('No autenticado', 401);
  const usuario = await Usuario.findByPk(userPayload.usuario_id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  const issuer = 'AutoSales';
  const label = `${issuer}:${usuario.email}`;
  const secret = speakeasy.generateSecret({ length: 20 });
  // Construir otpauth URL con parámetros explícitos para maximizar compatibilidad
  const otpauth_url = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret.base32.toUpperCase()}&issuer=${encodeURIComponent(issuer)}&period=30&digits=6&algorithm=SHA1`;
  const qr = await QRCode.toDataURL(otpauth_url);
  return { secret: secret.base32.toUpperCase(), otpauth_url, qr };
};

// Activar 2FA guardando el secreto si el código es válido
exports.enable2fa = async (userPayload, secret, code) => {
  if (!userPayload || !userPayload.usuario_id) throw new AppError('No autenticado', 401);
  if (!secret || !code) throw new AppError('Datos incompletos', 400);
  const tokenCode = String(code).replace(/\D/g, '');
  const cleanedSecret = String(secret).replace(/\s/g, '').toUpperCase();
  const verified = speakeasy.totp.verify({ secret: cleanedSecret, encoding: 'base32', token: tokenCode, window: 3, digits: 6, step: 30 });
  if (!verified) throw new AppError('Código 2FA inválido', 400);
  const usuario = await Usuario.findByPk(userPayload.usuario_id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  await usuario.update({ twofa_secret: cleanedSecret, twofa_enabled: true });
  const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
  return { usuario: usuarioData };
};

// Desactivar 2FA verificando código con el secreto almacenado
exports.disable2fa = async (userPayload, code) => {
  if (!userPayload || !userPayload.usuario_id) throw new AppError('No autenticado', 401);
  const usuario = await Usuario.findByPk(userPayload.usuario_id);
  if (!usuario || !usuario.twofa_enabled || !usuario.twofa_secret) throw new AppError('2FA no habilitado', 400);
  if (!code) throw new AppError('Código requerido', 400);
  const tokenCode = String(code).replace(/\D/g, '');
  const storedSecret = String(usuario.twofa_secret).replace(/\s/g, '').toUpperCase();
  const verified = speakeasy.totp.verify({ secret: storedSecret, encoding: 'base32', token: tokenCode, window: 3, digits: 6, step: 30 });
  if (!verified) throw new AppError('Código 2FA inválido', 400);
  await usuario.update({ twofa_secret: null, twofa_enabled: false });
  const { contraseña: _, twofa_secret: __, ...usuarioData } = usuario.toJSON();
  return { usuario: usuarioData };
};
