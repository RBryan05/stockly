// src/app/layout/navbar/navbar.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  menuAbierto = false;

  constructor(public authService: AuthService) {}

  get usuario() {
    return this.authService.getUsuario();
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}