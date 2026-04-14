import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-productos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css',
})
export class ProductosList {
  productos = [
    { id: 1, codigo: 'P001', nombre: 'Laptop Dell', categoria: 'Electrónica', stock: 15, precio: 850.00, estado: 'Activo' },
    { id: 2, codigo: 'P002', nombre: 'Mouse Logitech', categoria: 'Periféricos', stock: 3, precio: 25.00, estado: 'Activo' },
    { id: 3, codigo: 'P003', nombre: 'Teclado Mecánico', categoria: 'Periféricos', stock: 0, precio: 75.00, estado: 'Inactivo' },
    { id: 4, codigo: 'P004', nombre: 'Monitor LG 24"', categoria: 'Electrónica', stock: 8, precio: 320.00, estado: 'Activo' },
    { id: 5, codigo: 'P005', nombre: 'Silla Ergonómica', categoria: 'Mobiliario', stock: 2, precio: 450.00, estado: 'Activo' },
  ];


  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }


  esStockBajo(stock: number): boolean {
    return stock > 0 && stock < 5;
  }
}
