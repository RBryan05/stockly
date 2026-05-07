// src/routes/productos.js
const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  getProductosStockBajo,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');

// IMPORTANTE: /stock-bajo debe ir ANTES de /:id
router.get('/stock-bajo', getProductosStockBajo);
router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;