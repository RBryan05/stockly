import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../core/services/reportes.service';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  tabActiva: 'stock' | 'stockBajo' | 'movimientos' = 'stock';

  stockData: any = null;
  cargandoStock = false;

  stockBajoData: any = null;
  cargandoStockBajo = false;

  movData: any = null;
  cargandoMov = false;
  filtroDesde = '';
  filtroHasta = '';
  filtroTipo = '';

  error = '';

  constructor(
    private reportesService: ReportesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarStockActual();
  }

  cambiarTab(tab: 'stock' | 'stockBajo' | 'movimientos') {
    this.tabActiva = tab;
    this.error = '';
    this.cdr.detectChanges();
    if (tab === 'stock' && !this.stockData) this.cargarStockActual();
    if (tab === 'stockBajo' && !this.stockBajoData) this.cargarStockBajo();
    if (tab === 'movimientos' && !this.movData) this.cargarMovimientos();
  }

  cargarStockActual() {
    this.cargandoStock = true;
    this.cdr.detectChanges();
    this.reportesService.getStockActual().subscribe({
      next: (res) => {
        this.stockData = res;
        this.cargandoStock = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar reporte.';
        this.cargandoStock = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarStockBajo() {
    this.cargandoStockBajo = true;
    this.cdr.detectChanges();
    this.reportesService.getStockBajo().subscribe({
      next: (res) => {
        this.stockBajoData = res;
        this.cargandoStockBajo = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar reporte.';
        this.cargandoStockBajo = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarMovimientos() {
    this.cargandoMov = true;
    this.cdr.detectChanges();
    const params: Record<string, string> = {};
    if (this.filtroDesde) params['desde'] = this.filtroDesde;
    if (this.filtroHasta) params['hasta'] = this.filtroHasta;
    if (this.filtroTipo) params['tipo'] = this.filtroTipo;

    this.reportesService.getMovimientos(params).subscribe({
      next: (res) => {
        this.movData = res;
        this.cargandoMov = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar reporte.';
        this.cargandoMov = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltrosMov() {
    this.movData = null;
    this.cargarMovimientos();
  }

  getBadgeStock(item: any): string {
    if (item.stockActual === 0) return 'badge-stock-empty';
    if (item.stockBajo) return 'badge-stock-low';
    return 'badge-stock-ok';
  }
}