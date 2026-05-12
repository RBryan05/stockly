import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  cargando = false;
  mostrarPassword = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  iniciarSesion() {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        this.cargando = false;
        this.cdr.detectChanges();

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando = false;

        this.errorMsg =
          err.error?.mensaje ||
          err.error?.message ||
          'Credenciales incorrectas.';

        this.cdr.detectChanges();
      }
    });
  }
}