// src/controllers/categoriasController.js
const Categoria = require("../models/Categoria");

// GET /api/v1/categorias
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json({ ok: true, total: categorias.length, data: categorias });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/categorias/:id
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria || !categoria.activo) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }
    res.json({ ok: true, data: categoria });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/v1/categorias
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ ok: false, message: "El nombre es obligatorio" });
    }

    // Solo verifica duplicado entre categorías activas
    const existe = await Categoria.findOne({
      nombre: nombre.trim(),
      activo: true,
    });
    if (existe) {
      return res
        .status(400)
        .json({ ok: false, message: "Ya existe una categoría con ese nombre" });
    }

    const categoria = new Categoria({ nombre: nombre.trim(), descripcion });
    await categoria.save();

    res
      .status(201)
      .json({
        ok: true,
        message: "Categoría creada exitosamente",
        data: categoria,
      });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /api/v1/categorias/:id
const actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, activo } = req.body;

    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }

    // Solo verifica duplicado entre categorías activas excluyendo la actual
    if (nombre && nombre.trim() !== categoria.nombre) {
      const existe = await Categoria.findOne({
        nombre: nombre.trim(),
        activo: true,
      });
      if (existe) {
        return res
          .status(400)
          .json({
            ok: false,
            message: "Ya existe una categoría con ese nombre",
          });
      }
    }

    if (nombre !== undefined) categoria.nombre = nombre.trim();
    if (descripcion !== undefined) categoria.descripcion = descripcion;
    if (activo !== undefined) categoria.activo = activo;

    await categoria.save();

    res.json({
      ok: true,
      message: "Categoría actualizada exitosamente",
      data: categoria,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /api/v1/categorias/:id (soft delete)
const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }

    categoria.activo = false;
    await categoria.save();

    res.json({ ok: true, message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const reactivarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }
    categoria.activo = true;
    await categoria.save();
    res.json({ ok: true, message: "Categoría reactivada correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  reactivarCategoria,
};
