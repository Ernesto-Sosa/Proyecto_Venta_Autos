const Cita_Prueba_Manejo = require("../models/cita_prueba_manejo");

exports.createCita = async (datos) => {
  const cita = await Cita_Prueba_Manejo.create(datos);
  return cita;
};

exports.getAllCitas = async () => {
  const citas = await Cita_Prueba_Manejo.findAll();
  return citas;
};

exports.getCitaById = async (id) => {
  const cita = await Cita_Prueba_Manejo.findByPk(id);
  return cita;
};

exports.updateCita = async (id, datos) => {
  const cita = await Cita_Prueba_Manejo.findByPk(id);
  if (cita) {
    await cita.update(datos);
  }
  return cita;
};

exports.deleteCita = async (id) => {
  const cita = await Cita_Prueba_Manejo.findByPk(id);
  if (cita) {
    await cita.destroy();
  }
  return cita;
};
