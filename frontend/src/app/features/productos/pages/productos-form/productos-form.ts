import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-productos-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './productos-form.html',
  styleUrl: './productos-form.css',
})
export class ProductosForm {
  producto = {
    codigo: '',
    nombre: '',
    categoria: '',
    stock: 0,
    precio: 0,
    estado: 'Activo',
    descripcion: '',
  };


  categorias = ['Electrónica', 'Periféricos', 'Mobiliario', 'Papelería', 'Limpieza'];


  constructor(private router: Router) {}


  guardar() {
    console.log('Producto guardado:', this.producto);
    this.router.navigate(['/productos']);
  }


  cancelar() {
    this.router.navigate(['/productos']);
  }
}
