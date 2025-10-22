const Cita_Prueba_Manejo = require("../models/cita_prueba_manejo");

// Crear una nueva cita de prueba de manejo
exports.createCita = async (req, res) => {
  try {
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    const cita = await Cita_Prueba_Manejo.create({ fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    res.status(201).json({ message: "Cita creada exitosamente", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las citas
exports.getAllCitas = async (req, res) => {
  try {
    const citas = await Cita_Prueba_Manejo.findAll();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una cita por ID
exports.getCitaById = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita_Prueba_Manejo.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cita
exports.updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id } = req.body;
    const cita = await Cita_Prueba_Manejo.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    await cita.update({ fecha_cita, hora_cita, estado, notas, usuario_id, vehiculo_id });
    res.status(200).json({ message: "Cita actualizada exitosamente", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una cita
exports.deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita_Prueba_Manejo.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    await cita.destroy();
    res.status(200).json({ message: "Cita eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
