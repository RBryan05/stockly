// src/controllers/reportesController.js
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const Movimiento = require('../models/Movimiento');

// GET /api/v1/reportes/stock-actual
// Lista todos los productos con su estado de stock
// Query params: ?categoria=id
const reporteStockActual = async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;

    const productos = await Producto.find(filtro)
      .populate('categoria', 'nombre')
      .sort({ nombre: 1 });

    const data = productos.map((p) => ({
      id: p._id,
      nombre: p.nombre,
      categoria: p.categoria?.nombre || 'Sin categoría',
      precio: p.precio,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      stockBajo: p.stockActual <= p.stockMinimo,
      imagen: p.imagen?.url || '',
    }));

    const resumen = {
      totalProductos: data.length,
      enStockBajo: data.filter((p) => p.stockBajo).length,
      enStockNormal: data.filter((p) => !p.stockBajo).length,
    };

    res.json({ ok: true, resumen, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/reportes/movimientos
// Movimientos en un rango de fechas
// Query params: ?desde=2024-01-01&hasta=2024-12-31&producto=id&tipo=entrada|salida
const reporteMovimientos = async (req, res) => {
  try {
    const { desde, hasta, producto, tipo } = req.query;

    const filtro = {};

    // Rango de fechas
    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) {
        // Incluir todo el día "hasta"
        const hastaFin = new Date(hasta);
        hastaFin.setHours(23, 59, 59, 999);
        filtro.createdAt.$lte = hastaFin;
      }
    }

    if (producto) filtro.producto = producto;
    if (tipo && ['entrada', 'salida'].includes(tipo)) filtro.tipo = tipo;

    const movimientos = await Movimiento.find(filtro)
      .populate('producto', 'nombre precio')
      .sort({ createdAt: -1 });

    // Totales
    const totalEntradas = movimientos
      .filter((m) => m.tipo === 'entrada')
      .reduce((acc, m) => acc + m.cantidad, 0);

    const totalSalidas = movimientos
      .filter((m) => m.tipo === 'salida')
      .reduce((acc, m) => acc + m.cantidad, 0);

    const resumen = {
      totalMovimientos: movimientos.length,
      totalEntradas,
      totalSalidas,
      periodo: {
        desde: desde || 'Sin límite',
        hasta: hasta || 'Sin límite',
      },
    };

    res.json({ ok: true, resumen, data: movimientos });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/reportes/stock-bajo
// Productos que necesitan reposición urgente
const reporteStockBajo = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true })
      .populate('categoria', 'nombre')
      .sort({ stockActual: 1 }); // Los más críticos primero

    const stockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo);

    const data = stockBajo.map((p) => ({
      id: p._id,
      nombre: p.nombre,
      categoria: p.categoria?.nombre || 'Sin categoría',
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      unidadesFaltantes: p.stockMinimo - p.stockActual,
      critico: p.stockActual === 0,
      imagen: p.imagen?.url || '',
    }));

    const resumen = {
      totalEnStockBajo: data.length,
      criticos: data.filter((p) => p.critico).length, // Sin stock
      bajos: data.filter((p) => !p.critico).length,   // Por debajo del mínimo
    };

    res.json({ ok: true, resumen, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/reportes/dashboard
// Resumen general para la pantalla principal
const reporteDashboard = async (req, res) => {
  try {
    // Rango del mes actual
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

    // Consultas en paralelo para mejor rendimiento
    const [
      totalProductos,
      totalCategorias,
      todosProductos,
      movimientosMes,
      todosMovimientos,
    ] = await Promise.all([
      Producto.countDocuments({ activo: true }),
      Categoria.countDocuments({ activo: true }),
      Producto.find({ activo: true }),
      Movimiento.find({ createdAt: { $gte: inicioMes, $lte: finMes } }),
      Movimiento.find().populate('producto', 'nombre'),
    ]);

    // Productos con stock bajo
    const productosStockBajo = todosProductos.filter(
      (p) => p.stockActual <= p.stockMinimo
    ).length;

    // Movimientos del mes
    const entradasMes = movimientosMes.filter((m) => m.tipo === 'entrada').length;
    const salidasMes = movimientosMes.filter((m) => m.tipo === 'salida').length;

    // Producto con más movimientos
    const conteoMovimientos = {};
    todosMovimientos.forEach((m) => {
      if (!m.producto) return;
      const id = m.producto._id.toString();
      const nombre = m.producto.nombre;
      if (!conteoMovimientos[id]) {
        conteoMovimientos[id] = { id, nombre, total: 0 };
      }
      conteoMovimientos[id].total += 1;
    });

    const productoMasMovimientos = Object.values(conteoMovimientos).sort(
      (a, b) => b.total - a.total
    )[0] || null;

    // Últimos 5 movimientos
    const ultimosMovimientos = await Movimiento.find()
      .populate('producto', 'nombre')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      ok: true,
      data: {
        inventario: {
          totalProductos,
          totalCategorias,
          productosStockBajo,
        },
        movimientosMes: {
          total: movimientosMes.length,
          entradas: entradasMes,
          salidas: salidasMes,
          mes: ahora.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
        },
        productoMasMovimientos,
        ultimosMovimientos,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = {
  reporteStockActual,
  reporteMovimientos,
  reporteStockBajo,
  reporteDashboard,
};