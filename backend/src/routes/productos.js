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
const upload = require('../middlewares/upload.middleware');

// IMPORTANTE: /stock-bajo debe ir ANTES de /:id
router.get('/stock-bajo', getProductosStockBajo);
router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', upload.single('imagen'), crearProducto);       // imagen es opcional
router.put('/:id', upload.single('imagen'), actualizarProducto); // imagen es opcional
router.delete('/:id', eliminarProducto);

module.exports = router;