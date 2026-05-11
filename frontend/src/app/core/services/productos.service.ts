// src/app/core/services/productos.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Categoria {
  _id: string;
  nombre: string;
}

export interface Producto {
  _id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  categoria: Categoria;
  imagen: { url: string; publicId: string };
  activo: boolean;
  stockBajo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  constructor(private api: ApiService) {}

  getProductos(params?: Record<string, string>): Observable<{ ok: boolean; total: number; data: Producto[] }> {
    return this.api.get('productos', params);
  }

  getProductoById(id: string): Observable<{ ok: boolean; data: Producto }> {
    return this.api.get(`productos/${id}`);
  }

  getStockBajo(): Observable<{ ok: boolean; total: number; data: Producto[] }> {
    return this.api.get('productos/stock-bajo');
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.api.postFormData('productos', formData);
  }

  actualizarProducto(id: string, formData: FormData): Observable<any> {
    return this.api.putFormData(`productos/${id}`, formData);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.api.delete(`productos/${id}`);
  }
}