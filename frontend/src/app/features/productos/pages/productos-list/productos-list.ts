import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../../../core/services/productos.service';
import { CategoriasService } from '../../../../core/services/categorias.service';

@Component({
  selector: 'app-productos-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css',
})
export class ProductosList implements OnInit {
  productos: Producto[] = [];
  categorias: any[] = [];
  cargando = true;
  error = '';
  filtroCat = '';
  filtroStock = '';
  productoAEliminar: Producto | null = null;
  eliminando = false;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProductos();
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

  cargarProductos() {
    this.cargando = true;
    const params: Record<string, string> = {};
    if (this.filtroCat) params['categoria'] = this.filtroCat;
    if (this.filtroStock === 'bajo') params['stockBajo'] = 'true';

    this.productosService.getProductos(params).subscribe({
      next: (res) => {
        this.productos = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar productos.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltros() {
    this.cargarProductos();
  }

  limpiarFiltros() {
    this.filtroCat = '';
    this.filtroStock = '';
    this.cargarProductos();
  }

  confirmarEliminar(producto: Producto) {
    this.productoAEliminar = producto;
    this.cdr.detectChanges();
  }

  cancelarEliminar() {
    this.productoAEliminar = null;
    this.cdr.detectChanges();
  }

  eliminar() {
    if (!this.productoAEliminar) return;
    this.eliminando = true;
    this.productosService.eliminarProducto(this.productoAEliminar._id).subscribe({
      next: () => {
        this.productos = this.productos.filter(
          (p) => p._id !== this.productoAEliminar!._id,
        );
        this.productoAEliminar = null;
        this.eliminando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar.';
        this.eliminando = false;
        this.cdr.detectChanges();
      },
    });
  }

  getImagenUrl(producto: Producto): string {
    return producto.imagen?.url || '';
  }

  getBadgeStock(p: Producto): string {
    if (p.stockActual === 0) return 'badge-stock-empty';
    if (p.stockActual <= p.stockMinimo) return 'badge-stock-low';
    return 'badge-stock-ok';
  }
}