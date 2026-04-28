const express = require('express');
const router = express.Router();
const { getCategorias, getCategoriaById } = require('../controllers/categoriasController');

router.get('/', getCategorias);
router.get('/:id', getCategoriaById);

module.exports = router;