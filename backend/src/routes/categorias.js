// src/routes/categorias.js
const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  reactivarCategoria,
} = require('../controllers/categoriasController');

router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);
router.patch('/:id/reactivar', reactivarCategoria);

module.exports = router;