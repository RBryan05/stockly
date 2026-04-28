const Producto = require('../models/Producto');

// GET /api/v1/productos
const getProductos = async (req, res) => {
  try {
    const { categoria, stockBajo } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;
    let productos = await Producto.find(filtro)
      .populate('categoria', 'nombre')
      .sort({ nombre: 1 });
    if (stockBajo === 'true') {
      productos = productos.filter((p) => p.stockActual <= p.stockMinimo);
    }
    res.json({ ok: true, total: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/productos/:id
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria', 'nombre');
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/productos/stock-bajo
const getProductosStockBajo = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true })
      .populate('categoria', 'nombre');
    const stockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo);
    res.json({ ok: true, total: stockBajo.length, data: stockBajo });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { getProductos, getProductoById, getProductosStockBajo };
