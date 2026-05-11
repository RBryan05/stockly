// src/app/core/services/reportes.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardData {
  inventario: {
    totalProductos: number;
    totalCategorias: number;
    productosStockBajo: number;
  };
  movimientosMes: {
    total: number;
    entradas: number;
    salidas: number;
    mes: string;
  };
  productoMasMovimientos: { id: string; nombre: string; total: number } | null;
  ultimosMovimientos: any[];
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  constructor(private api: ApiService) {}

  getDashboard(): Observable<{ ok: boolean; data: DashboardData }> {
    return this.api.get('reportes/dashboard');
  }

  getStockActual(categoria?: string): Observable<any> {
    return this.api.get('reportes/stock-actual', categoria ? { categoria } : undefined);
  }

  getStockBajo(): Observable<any> {
    return this.api.get('reportes/stock-bajo');
  }

  getMovimientos(params?: Record<string, string>): Observable<any> {
    return this.api.get('reportes/movimientos', params);
  }
}