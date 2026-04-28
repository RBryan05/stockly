const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto es obligatorio'],
    },
    tipo: {
      type: String,
      enum: ['entrada', 'salida'],
      required: [true, 'El tipo de movimiento es obligatorio'],
    },
    cantidad: { type: Number, required: true, min: 1 },
    motivo: { type: String, trim: true, default: '' },
    stockAnterior: { type: Number, required: true },
    stockResultante: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movimiento', movimientoSchema);
