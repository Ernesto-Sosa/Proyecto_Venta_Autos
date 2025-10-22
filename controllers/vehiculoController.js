const Vehiculo = require("../models/vehiculo");

// Crear un nuevo vehículo
exports.createVehiculo = async (req, res) => {
  try {
    const { marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    const vehiculo = await Vehiculo.create({ marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id });
    res.status(201).json({ message: "Vehículo creado exitosamente", vehiculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los vehículos
exports.getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un vehículo por ID
exports.getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.status(200).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un vehículo
exports.updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id } = req.body;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    await vehiculo.update({ marca, modelo, precio, año, kilometraje, color, tipo_combustible, descripcion, estado, usuario_id });
    res.status(200).json({ message: "Vehículo actualizado exitosamente", vehiculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un vehículo
exports.deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    await vehiculo.destroy();
    res.status(200).json({ message: "Vehículo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
