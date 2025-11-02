const Vehiculo = require("../models/vehiculo");

exports.createVehiculo = async (datos) => {
  const vehiculo = await Vehiculo.create(datos);
  return vehiculo;
};

exports.getAllVehiculos = async () => {
  const vehiculos = await Vehiculo.findAll();
  return vehiculos;
};

exports.getVehiculoById = async (id) => {
  const vehiculo = await Vehiculo.findByPk(id);
  return vehiculo;
};

exports.updateVehiculo = async (id, datos) => {
  const vehiculo = await Vehiculo.findByPk(id);
  if (vehiculo) {
    await vehiculo.update(datos);
  }
  return vehiculo;
};

exports.deleteVehiculo = async (id) => {
  const vehiculo = await Vehiculo.findByPk(id);
  if (vehiculo) {
    await vehiculo.destroy();
  }
  return vehiculo;
};
