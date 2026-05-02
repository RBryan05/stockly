require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const movimientosRoutes = require('./routes/movimientos');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Inventario de Productos con Control de Stock',
    version: 'v1',
  });
});

app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/movimientos', movimientosRoutes);
app.use('/api/v1/auth', authRoutes); 

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});