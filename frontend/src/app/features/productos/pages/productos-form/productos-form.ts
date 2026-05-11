import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosService } from '../../../../core/services/productos.service';
import { CategoriasService } from '../../../../core/services/categorias.service';

@Component({
  selector: 'app-productos-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos-form.html',
  styleUrl: './productos-form.css',
})
export class ProductosForm implements OnInit {
  esEdicion = false;
  productoId = '';
  cargando = false;
  cargandoDatos = false;
  error = '';
  exito = '';

  categorias: any[] = [];
  imagenPreview: string | null = null;
  imagenFile: File | null = null;

  form = {
    nombre: '',
    marca: '',
    descripcion: '',
    precio: 0,
    stockActual: 0,
    stockMinimo: 5,
    categoria: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.productoId = id;
      this.cargarProducto(id);
    }
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res.data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarProducto(id: string) {
    this.cargandoDatos = true;
    this.productosService.getProductoById(id).subscribe({
      next: (res) => {
        const p = res.data;
        this.form = {
          nombre: p.nombre,
          marca: p.marca || '',
          descripcion: p.descripcion,
          precio: p.precio,
          stockActual: p.stockActual,
          stockMinimo: p.stockMinimo,
          categoria: p.categoria?._id || '',
        };
        if (p.imagen?.url) this.imagenPreview = p.imagen.url;
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el producto.';
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
    });
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'La imagen no puede superar los 5MB.';
      this.cdr.detectChanges();
      return;
    }
    this.imagenFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagenPreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  quitarImagen() {
    this.imagenFile = null;
    this.imagenPreview = null;
    this.cdr.detectChanges();
  }

  guardar() {
    this.error = '';
    this.exito = '';

    if (!this.form.nombre || !this.form.categoria || this.form.precio < 0) {
      this.error = 'Nombre, categoría y precio son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    const fd = new FormData();
    fd.append('nombre', this.form.nombre.trim());
    fd.append('descripcion', this.form.descripcion);
    fd.append('precio', String(this.form.precio));
    fd.append('stockActual', String(this.form.stockActual));
    fd.append('stockMinimo', String(this.form.stockMinimo));
    fd.append('marca', this.form.marca);
    fd.append('categoria', this.form.categoria);
    if (this.imagenFile) fd.append('imagen', this.imagenFile);

    this.cargando = true;
    this.cdr.detectChanges();

    const req = this.esEdicion
      ? this.productosService.actualizarProducto(this.productoId, fd)
      : this.productosService.crearProducto(fd);

    req.subscribe({
      next: () => {
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al guardar el producto.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }
}
