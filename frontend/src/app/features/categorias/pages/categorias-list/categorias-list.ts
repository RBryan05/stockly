import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-categorias-list',
  imports: [CommonModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList {
  categorias = [
    { id: 1, codigo: 'C001', nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos', totalProductos: 12, estado: 'Activo' },
    { id: 2, codigo: 'C002', nombre: 'Periféricos', descripcion: 'Accesorios de computadora', totalProductos: 8, estado: 'Activo' },
    { id: 3, codigo: 'C003', nombre: 'Mobiliario', descripcion: 'Muebles de oficina', totalProductos: 5, estado: 'Activo' },
    { id: 4, codigo: 'C004', nombre: 'Papelería', descripcion: 'Artículos de oficina', totalProductos: 20, estado: 'Activo' },
    { id: 5, codigo: 'C005', nombre: 'Limpieza', descripcion: 'Artículos de limpieza', totalProductos: 3, estado: 'Inactivo' },
  ];


  eliminarCategoria(id: number) {
    this.categorias = this.categorias.filter(c => c.id !== id);
  }
}
