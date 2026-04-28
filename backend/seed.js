require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Categoria = require('./src/models/Categoria');
const Producto = require('./src/models/Producto');
const Movimiento = require('./src/models/Movimiento');

const seedDB = async () => {
  await connectDB();
  await Movimiento.deleteMany();
  await Producto.deleteMany();
  await Categoria.deleteMany();
  console.log('Datos anteriores eliminados');

  const categorias = await Categoria.insertMany([
    { nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos' },
    { nombre: 'Ropa', descripcion: 'Prendas de vestir' },
    { nombre: 'Alimentos', descripcion: 'Productos alimenticios' },
    { nombre: 'Hogar', descripcion: 'Artículos para el hogar' },
  ]);

  const productos = await Producto.insertMany([
    { nombre: 'Laptop HP 15"', descripcion: 'Intel i5 8GB RAM', precio: 799.99,
      stockActual: 12, stockMinimo: 5, categoria: categorias[0]._id },
    { nombre: 'Mouse Inalámbrico', descripcion: 'Óptico 2.4GHz', precio: 19.99,
      stockActual: 3, stockMinimo: 5, categoria: categorias[0]._id },
    { nombre: 'Camiseta Básica', descripcion: '100% algodón', precio: 12.99,
      stockActual: 50, stockMinimo: 10, categoria: categorias[1]._id },
    { nombre: 'Arroz 5lb', descripcion: 'Grano largo', precio: 4.50,
      stockActual: 2, stockMinimo: 20, categoria: categorias[2]._id },
  ]);

  await Movimiento.insertMany([
    { producto: productos[0]._id, tipo: 'entrada', cantidad: 20,
      motivo: 'Compra inicial', stockAnterior: 0, stockResultante: 20 },
    { producto: productos[0]._id, tipo: 'salida', cantidad: 8,
      motivo: 'Venta', stockAnterior: 20, stockResultante: 12 },
    { producto: productos[1]._id, tipo: 'entrada', cantidad: 10,
      motivo: 'Reposición', stockAnterior: 0, stockResultante: 10 },
    { producto: productos[1]._id, tipo: 'salida', cantidad: 7,
      motivo: 'Venta', stockAnterior: 10, stockResultante: 3 },
  ]);

  console.log('Base de datos poblada exitosamente');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});