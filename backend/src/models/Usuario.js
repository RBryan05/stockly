const mongoose = require('mongoose');

// Definimos el "esquema" (la estructura) del usuario en MongoDB
const usuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Asegura que no haya dos correos iguales
    },
    password: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true // Esto crea automáticamente las fechas de 'creado' y 'actualizado'
});

// Exportamos el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);