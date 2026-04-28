const Categoria = require('../models/Categoria');

// GET /api/v1/categorias
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ activo: true }).sort({ nombre: 1 });
    res.json({ ok: true, total: categorias.length, data: categorias });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/categorias/:id
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
    }
    res.json({ ok: true, data: categoria });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { getCategorias, getCategoriaById };
