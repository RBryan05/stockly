// src/controllers/productosController.js
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const cloudinary = require("../config/cloudinary");

// GET /api/v1/productos
const getProductos = async (req, res) => {
  try {
    const { categoria, stockBajo } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;

    let productos = await Producto.find(filtro)
      .populate("categoria", "nombre")
      .sort({ nombre: 1 });

    if (stockBajo === "true") {
      productos = productos.filter((p) => p.stockActual <= p.stockMinimo);
    }

    res.json({ ok: true, total: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/productos/:id
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate(
      "categoria",
      "nombre",
    );
    if (!producto || !producto.activo) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }
    res.json({ ok: true, data: producto });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/v1/productos/stock-bajo
const getProductosStockBajo = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true }).populate(
      "categoria",
      "nombre",
    );
    const stockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo);
    res.json({ ok: true, total: stockBajo.length, data: stockBajo });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/v1/productos
const crearProducto = async (req, res) => {
  try {
    const { nombre, marca, descripcion, precio, stockActual, stockMinimo, categoria } = req.body;

    if (!nombre || precio === undefined || !categoria) {
      // Si se subió imagen pero hay error de validación, eliminarla de Cloudinary
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        message: "nombre, precio y categoria son obligatorios",
      });
    }

    const categoriaExiste = await Categoria.findOne({
      _id: categoria,
      activo: true,
    });
    if (!categoriaExiste) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        message: "La categoría no existe o está inactiva",
      });
    }

    const producto = new Producto({
      nombre: nombre.trim(),
      marca: marca || "",
      descripcion,
      precio,
      stockActual: stockActual ?? 0,
      stockMinimo: stockMinimo ?? 5,
      categoria,
      imagen: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });

    await producto.save();
    await producto.populate("categoria", "nombre");

    res
      .status(201)
      .json({
        ok: true,
        message: "Producto creado exitosamente",
        data: producto,
      });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /api/v1/productos/:id
const actualizarProducto = async (req, res) => {
  try {
    const { nombre, marca, descripcion, precio, stockMinimo, categoria, activo } = req.body;

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    if (categoria) {
      const categoriaExiste = await Categoria.findOne({ _id: categoria, activo: true });
      if (!categoriaExiste) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({
          ok: false,
          message: 'La categoría no existe o está inactiva',
        });
      }
    }

    if (nombre !== undefined) producto.nombre = nombre.trim();
    if (marca !== undefined) producto.marca = marca;
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (precio !== undefined) producto.precio = precio;
    if (stockMinimo !== undefined) producto.stockMinimo = stockMinimo;
    if (categoria !== undefined) producto.categoria = categoria;
    if (activo !== undefined) producto.activo = activo;

    if (req.file) {
      if (producto.imagen?.publicId) {
        await cloudinary.uploader.destroy(producto.imagen.publicId);
      }
      producto.imagen = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await producto.save();
    await producto.populate('categoria', 'nombre');

    res.json({ ok: true, message: 'Producto actualizado exitosamente', data: producto });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /api/v1/productos/:id  (soft delete)
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }

    producto.activo = false;
    await producto.save();

    res.json({ ok: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  getProductosStockBajo,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
