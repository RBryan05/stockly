// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { verificarToken } = require('./middlewares/auth.middleware');

const authRoutes = require('./routes/auth');
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const movimientosRoutes = require('./routes/movimientos');
const userRoutes = require('./routes/user.routes');
const reportesRoutes = require('./routes/reportes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Ruta base pública 
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Inventario de Productos con Control de Stock',
    version: 'v1',
    roles: ['admin', 'empleado'],
  });
});

// Rutas públicas 
app.use('/api/v1/auth', authRoutes);

// Rutas protegidas (token requerido en todas) 
// El middleware verificarToken va aquí una sola vez.
// El control fino de roles va dentro de cada router.
app.use('/api/v1/categorias',   verificarToken, categoriasRoutes);
app.use('/api/v1/productos',    verificarToken, productosRoutes);
app.use('/api/v1/movimientos',  verificarToken, movimientosRoutes);
app.use('/api/v1/usuarios',     verificarToken, userRoutes);
app.use('/api/v1/reportes', verificarToken, reportesRoutes);

// Manejo de errores 
app.use(notFound);
app.use(errorHandler);

// Servidor 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});