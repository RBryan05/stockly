// src/app/core/services/movimientos.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Movimiento {
  _id: string;
  producto: { _id: string; nombre: string };
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  stockAnterior: number;
  stockResultante: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  constructor(private api: ApiService) {}

  getMovimientos(params?: Record<string, string>): Observable<{ ok: boolean; total: number; data: Movimiento[] }> {
    return this.api.get('movimientos', params);
  }

  crearMovimiento(body: {
    producto: string;
    tipo: string;
    cantidad: number;
    motivo: string;
  }): Observable<any> {
    return this.api.post('movimientos', body);
  }
}