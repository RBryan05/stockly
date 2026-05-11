// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'empleado';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): Usuario | null {
    const data = localStorage.getItem('usuario');
    if (!data) return null;
    try {
      return JSON.parse(data) as Usuario;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUsuario()?.rol === 'admin';
  }

  isEmpleado(): boolean {
    return this.getUsuario()?.rol === 'empleado';
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}