// src/app/core/services/categorias.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  constructor(private api: ApiService) {}

  getCategorias(): Observable<{ ok: boolean; total: number; data: Categoria[] }> {
    return this.api.get('categorias');
  }

  getCategoriaById(id: string): Observable<{ ok: boolean; data: Categoria }> {
    return this.api.get(`categorias/${id}`);
  }

  crearCategoria(body: { nombre: string; descripcion: string }): Observable<any> {
    return this.api.post('categorias', body);
  }

  actualizarCategoria(id: string, body: Partial<Categoria>): Observable<any> {
    return this.api.put(`categorias/${id}`, body);
  }

  eliminarCategoria(id: string): Observable<any> {
    return this.api.delete(`categorias/${id}`);
  }

  reactivarCategoria(id: string): Observable<any> {
    return this.api.patch(`categorias/${id}/reactivar`, {});
  }
}
