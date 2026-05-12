import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportesService, DashboardData } from '../../core/services/reportes.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  data: DashboardData | null = null;
  cargando = true;
  error = '';

  constructor(
    private reportesService: ReportesService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.reportesService.getDashboard().subscribe({
      next: (res) => {
        this.data = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar el dashboard.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}