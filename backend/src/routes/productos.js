const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  getProductosStockBajo,
} = require('../controllers/productosController');

router.get('/stock-bajo', getProductosStockBajo);
router.get('/', getProductos);
router.get('/:id', getProductoById);

module.exports = router;