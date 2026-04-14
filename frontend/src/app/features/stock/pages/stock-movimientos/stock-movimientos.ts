import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-stock-movimientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-movimientos.html',
  styleUrl: './stock-movimientos.css',
})
export class StockMovimientos {
  movimientos = [
    { id: 1, fecha: '2026-04-10', producto: 'Laptop Dell', tipo: 'Entrada', cantidad: 10, responsable: 'Juan García', observacion: 'Compra proveedor' },
    { id: 2, fecha: '2026-04-10', producto: 'Mouse Logitech', tipo: 'Salida', cantidad: 2, responsable: 'María López', observacion: 'Venta cliente' },
    { id: 3, fecha: '2026-04-11', producto: 'Monitor LG 24"', tipo: 'Entrada', cantidad: 5, responsable: 'Juan García', observacion: 'Reabastecimiento' },
    { id: 4, fecha: '2026-04-11', producto: 'Silla Ergonómica', tipo: 'Salida', cantidad: 1, responsable: 'Pedro Martínez', observacion: 'Uso interno' },
  ];


  nuevoMovimiento = {
    producto: '',
    tipo: 'Entrada',
    cantidad: 0,
    responsable: '',
    observacion: '',
  };


  productos = ['Laptop Dell', 'Mouse Logitech', 'Teclado Mecánico', 'Monitor LG 24"', 'Silla Ergonómica'];


  registrarMovimiento() {
    if (this.nuevoMovimiento.producto && this.nuevoMovimiento.cantidad > 0) {
      this.movimientos.unshift({
        id: this.movimientos.length + 1,
        fecha: new Date().toISOString().split('T')[0],
        ...this.nuevoMovimiento,
      });
      this.nuevoMovimiento = { producto: '', tipo: 'Entrada', cantidad: 0, responsable: '', observacion: '' };
    }
  }
}
