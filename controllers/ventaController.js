const Venta = require("../models/venta");

exports.createVenta = async (datos) => {
  const venta = await Venta.create(datos);
  return venta;
};

exports.getAllVentas = async () => {
  const ventas = await Venta.findAll();
  return ventas;
};

exports.getVentaById = async (id) => {
  const venta = await Venta.findByPk(id);
  return venta;
};

exports.updateVenta = async (id, datos) => {
  const venta = await Venta.findByPk(id);
  if (venta) {
    await venta.update(datos);
  }
  return venta;
};

exports.deleteVenta = async (id) => {
  const venta = await Venta.findByPk(id);
  if (venta) {
    await venta.destroy();
  }
  return venta;
};
