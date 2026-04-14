import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = '';
  password = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.usuario && this.password) {
      this.router.navigate(['/dashboard']);
    }
  }
}