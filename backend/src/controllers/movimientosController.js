const Movimiento = require('../models/Movimiento');

// GET /api/v1/movimientos
const getMovimientos = async (req, res) => {
  try {
    const { producto, tipo } = req.query;
    const filtro = {};
    if (producto) filtro.producto = producto;
    if (tipo) filtro.tipo = tipo;
    const movimientos = await Movimiento.find(filtro)
      .populate('producto', 'nombre')
      .sort({ createdAt: -1 });
    res.json({ ok: true, total: movimientos.length, data: movimientos });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/movimientos/:id
const getMovimientoById = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id)
      .populate('producto', 'nombre');
    if (!movimiento) {
      return res.status(404).json({ ok: false, message: 'Movimiento no encontrado' });
    }
    res.json({ ok: true, data: movimiento });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { getMovimientos, getMovimientoById };