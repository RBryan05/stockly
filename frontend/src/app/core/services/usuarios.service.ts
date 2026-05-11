// src/app/core/services/usuarios.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'empleado';
  activo: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private api: ApiService) {}

  getUsuarios(): Observable<{ ok: boolean; total: number; data: Usuario[] }> {
    return this.api.get('usuarios');
  }

  crearUsuario(body: {
    nombre: string;
    email: string;
    password: string;
    rol: string;
  }): Observable<any> {
    return this.api.post('usuarios', body);
  }

  actualizarUsuario(
    id: string,
    body: { nombre?: string; email?: string; password?: string },
  ): Observable<any> {
    return this.api.put(`usuarios/${id}`, body);
  }

  desactivarUsuario(id: string): Observable<any> {
    return this.api.delete(`usuarios/${id}`);
  }

  reactivarUsuario(id: string): Observable<any> {
    return this.api.patch(`usuarios/${id}/reactivar`, {});
  }
}