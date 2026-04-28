const express = require('express');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Ruta de ejemplo
app.get('/api/v1/products', (req, res) => {
  res.json({
    ok: true,
    data: [
      { id: 1, name: 'Producto 1' },
      { id: 2, name: 'Producto 2' }
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});