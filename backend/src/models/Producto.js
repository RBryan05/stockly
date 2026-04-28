const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    descripcion: { type: String, trim: true, default: '' },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stockActual: { type: Number, default: 0, min: 0 },
    stockMinimo: { type: Number, default: 5, min: 0 },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es obligatoria'],
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productoSchema.virtual('stockBajo').get(function () {
  return this.stockActual <= this.stockMinimo;
});

productoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Producto', productoSchema);
