require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

//  IMPORTADO: middleware JWT (AGREGADO)
const { verificarToken } = require('./middlewares/auth.middleware');

const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const movimientosRoutes = require('./routes/movimientos');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

//  RUTA BASE (pública)
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Inventario de Productos con Control de Stock',
    version: 'v1',
  });
});


// ===============================
// RUTAS PÚBLICAS (NO SE PROTEGEN)
// ===============================
app.use('/api/v1/auth', authRoutes);


// ===============================
// RUTAS PROTEGIDAS (AGREGADO JWT)
// ===============================

// AQUÍ AGREGAMOS EL MIDDLEWARE verificarToken
// Esto hace que TODAS estas rutas requieran token válido

app.use('/api/v1/categorias', verificarToken, categoriasRoutes);
app.use('/api/v1/productos', verificarToken, productosRoutes);
app.use('/api/v1/movimientos', verificarToken, movimientosRoutes);
app.use('/api/v1/usuarios', verificarToken, userRoutes);

// ===============================
//  MANEJO DE ERRORES
// ===============================
app.use(notFound);
app.use(errorHandler);


// ===============================
// SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});