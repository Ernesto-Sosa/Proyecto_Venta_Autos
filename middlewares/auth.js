const jwt = require("jsonwebtoken");
const AppError = require("../error/appError");

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

exports.signToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", ...options });
};

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No autenticado", 401);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido o expirado", 401));
    }
    next(err);
  }
};

exports.requireRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return next(new AppError("No autenticado", 401));
    if (!roles || roles.length === 0) return next();

    const userRoleName = req.user.nombre_rol; // opcional si viene en el token
    const userRoleId = req.user.rol_id;

    const allowed = roles.some((r) => r === userRoleName || r === userRoleId);
    if (!allowed) return next(new AppError("No autorizado", 403));

    next();
  };
};
