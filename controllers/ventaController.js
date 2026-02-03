const Venta = require("../models/venta");
const Cita_Prueba_Manejo = require("../models/cita_prueba_manejo");
const Vehiculo = require("../models/vehiculo");
const sequelize = require("../helpers/database");

exports.createVenta = async (datos) => {
  return await sequelize.transaction(async (t) => {
    // Validar que el vehículo exista
    const vehiculo = await Vehiculo.findByPk(datos.vehiculo_id, { transaction: t });
    if (!vehiculo) {
      throw new Error("Vehículo no encontrado para la venta");
    }

    // Forzar estado_venta a 'Completada'
    const payload = {
      fecha: datos.fecha,
      precio_final: datos.precio_final,
      usuario_id: datos.usuario_id,
      vehiculo_id: datos.vehiculo_id,
      vehiculo_marca: vehiculo.marca,
      vehiculo_modelo: vehiculo.modelo,
      estado_venta: 'Completada',
    };

    const venta = await Venta.create(payload, { transaction: t });

    // Eliminar (soft delete) las citas asociadas a ese vehículo (y si aplica, por el usuario)
    await Cita_Prueba_Manejo.destroy({
      where: {
        vehiculo_id: datos.vehiculo_id,
      },
      transaction: t,
    });

    // Eliminar (soft delete) el vehículo vendido
    await vehiculo.destroy({ transaction: t });

    return venta;
  });
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
