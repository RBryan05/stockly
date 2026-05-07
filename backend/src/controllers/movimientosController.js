// src/controllers/movimientosController.js
const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');

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
    const movimiento = await Movimiento.findById(req.params.id).populate('producto', 'nombre');
    if (!movimiento) {
      return res.status(404).json({ ok: false, message: 'Movimiento no encontrado' });
    }
    res.json({ ok: true, data: movimiento });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/v1/movimientos
// Crea el movimiento Y actualiza el stock del producto de forma atómica
const crearMovimiento = async (req, res) => {
  // Usamos sesión de Mongoose para transacción atómica
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { producto: productoId, tipo, cantidad, motivo } = req.body;

    // Validaciones
    if (!productoId || !tipo || !cantidad) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        ok: false,
        message: 'producto, tipo y cantidad son obligatorios',
      });
    }

    if (!['entrada', 'salida'].includes(tipo)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        ok: false,
        message: 'El tipo debe ser "entrada" o "salida"',
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        ok: false,
        message: 'La cantidad debe ser un número entero positivo',
      });
    }

    // Buscar el producto
    const producto = await Producto.findOne({ _id: productoId, activo: true }).session(session);
    if (!producto) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ ok: false, message: 'Producto no encontrado o inactivo' });
    }

    // Validar stock suficiente en salidas
    if (tipo === 'salida' && producto.stockActual < cantidad) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        ok: false,
        message: `Stock insuficiente. Stock actual: ${producto.stockActual}, solicitado: ${cantidad}`,
      });
    }

    const stockAnterior = producto.stockActual;
    const stockResultante =
      tipo === 'entrada'
        ? stockAnterior + Number(cantidad)
        : stockAnterior - Number(cantidad);

    // Actualizar stock del producto
    producto.stockActual = stockResultante;
    await producto.save({ session });

    // Crear el movimiento
    const movimiento = new Movimiento({
      producto: productoId,
      tipo,
      cantidad: Number(cantidad),
      motivo: motivo || '',
      stockAnterior,
      stockResultante,
    });

    await movimiento.save({ session });
    await session.commitTransaction();
    session.endSession();

    await movimiento.populate('producto', 'nombre');

    res.status(201).json({
      ok: true,
      message: `Movimiento de ${tipo} registrado. Stock actualizado: ${stockAnterior} → ${stockResultante}`,
      data: movimiento,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { getMovimientos, getMovimientoById, crearMovimiento };