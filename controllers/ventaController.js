const Venta = require("../models/venta");

// Crear una nueva venta
exports.createVenta = async (req, res) => {
  try {
    const { fecha, precio_final, usuario_id, vehiculo_id, estado_venta } = req.body;
    const venta = await Venta.create({ fecha, precio_final, usuario_id, vehiculo_id, estado_venta });
    res.status(201).json({ message: "Venta creada exitosamente", venta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las ventas
exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una venta
exports.updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, precio_final, usuario_id, vehiculo_id, estado_venta } = req.body;
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    await venta.update({ fecha, precio_final, usuario_id, vehiculo_id, estado_venta });
    res.status(200).json({ message: "Venta actualizada exitosamente", venta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una venta
exports.deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    await venta.destroy();
    res.status(200).json({ message: "Venta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
