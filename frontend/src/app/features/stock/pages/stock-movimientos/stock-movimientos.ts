import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientosService, Movimiento } from '../../../../core/services/movimientos.service';
import { ProductosService, Producto } from '../../../../core/services/productos.service';

@Component({
  selector: 'app-stock-movimientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-movimientos.html',
  styleUrl: './stock-movimientos.css',
})
export class StockMovimientos implements OnInit {
  movimientos: Movimiento[] = [];
  productos: Producto[] = [];
  cargando = true;
  error = '';
  registrando = false;
  exito = '';

  filtroTipo = '';
  filtroProd = '';

  form = {
    producto: '',
    tipo: 'entrada',
    cantidad: 1,
    motivo: '',
  };
  formError = '';

  constructor(
    private movimientosService: MovimientosService,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarMovimientos();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (res) => {
        this.productos = res.data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  cargarMovimientos() {
    this.cargando = true;
    const params: Record<string, string> = {};
    if (this.filtroTipo) params['tipo'] = this.filtroTipo;
    if (this.filtroProd) params['producto'] = this.filtroProd;

    this.movimientosService.getMovimientos(params).subscribe({
      next: (res) => {
        this.movimientos = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar movimientos.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltros() {
    this.cargarMovimientos();
  }

  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroProd = '';
    this.cargarMovimientos();
  }

  registrar() {
    this.formError = '';
    this.exito = '';

    if (!this.form.producto) {
      this.formError = 'Selecciona un producto.';
      this.cdr.detectChanges();
      return;
    }
    if (!this.form.cantidad || this.form.cantidad < 1) {
      this.formError = 'La cantidad debe ser al menos 1.';
      this.cdr.detectChanges();
      return;
    }

    this.registrando = true;
    this.cdr.detectChanges();

    this.movimientosService.crearMovimiento({
      producto: this.form.producto,
      tipo: this.form.tipo,
      cantidad: Number(this.form.cantidad),
      motivo: this.form.motivo,
    }).subscribe({
      next: (res) => {
        this.exito = res.message || 'Movimiento registrado correctamente.';
        this.form = { producto: '', tipo: 'entrada', cantidad: 1, motivo: '' };
        this.registrando = false;
        this.cdr.detectChanges();
        this.cargarMovimientos();
        setTimeout(() => {
          this.exito = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.formError = err.error?.message || 'Error al registrar el movimiento.';
        this.registrando = false;
        this.cdr.detectChanges();
      },
    });
  }

  getProductoSeleccionado(): Producto | undefined {
    return this.productos.find((p) => p._id === this.form.producto);
  }
}