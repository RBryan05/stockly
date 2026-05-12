import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../../../core/services/usuarios.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;
  error = '';

  modalCrearAbierto = false;
  guardando = false;
  formCrear = { nombre: '', email: '', password: '', rol: 'empleado' };
  formError = '';

  modalEditarAbierto = false;
  usuarioEditando: Usuario | null = null;
  formEditar = { nombre: '', email: '', password: '' };

  usuarioAccion: Usuario | null = null;
  accion: 'desactivar' | 'reactivar' = 'desactivar';
  procesando = false;

  constructor(
    private usuariosService: UsuariosService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalCrear() {
    this.formCrear = { nombre: '', email: '', password: '', rol: 'empleado' };
    this.formError = '';
    this.modalCrearAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear() {
    this.modalCrearAbierto = false;
    this.cdr.detectChanges();
  }

  crear() {
    this.formError = '';
    const { nombre, email, password, rol } = this.formCrear;

    if (!nombre || !email || !password) {
      this.formError = 'Todos los campos son obligatorios.';
      this.cdr.detectChanges();
      return;
    }
    if (password.length < 8) {
      this.formError = 'La contraseña debe tener al menos 8 caracteres.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    this.usuariosService.crearUsuario({ nombre, email, password, rol }).subscribe({
      next: () => {
        this.guardando = false;
        this.modalCrearAbierto = false;
        this.cdr.detectChanges();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.formError = err.error?.mensaje || 'Error al crear usuario.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalEditar(u: Usuario) {
    this.usuarioEditando = u;
    this.formEditar = { nombre: u.nombre, email: u.email, password: '' };
    this.formError = '';
    this.modalEditarAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar() {
    this.modalEditarAbierto = false;
    this.usuarioEditando = null;
    this.cdr.detectChanges();
  }

  puedeEditar(u: Usuario): boolean {
    const yo = this.authService.getUsuario();
    if (!yo) return false;
    if (u.rol === 'admin' && u._id !== yo.id) return false;
    return true;
  }

  actualizar() {
    this.formError = '';
    if (!this.usuarioEditando) return;

    const { nombre, email, password } = this.formEditar;
    if (!nombre || !email) {
      this.formError = 'Nombre y email son obligatorios.';
      this.cdr.detectChanges();
      return;
    }
    if (password && password.length < 8) {
      this.formError = 'La contraseña debe tener al menos 8 caracteres.';
      this.cdr.detectChanges();
      return;
    }

    const body: any = { nombre, email };
    if (password) body.password = password;

    this.guardando = true;
    this.cdr.detectChanges();

    this.usuariosService.actualizarUsuario(this.usuarioEditando._id, body).subscribe({
      next: () => {
        this.guardando = false;
        this.modalEditarAbierto = false;
        this.cdr.detectChanges();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.formError = err.error?.mensaje || 'Error al actualizar.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }

  confirmarAccion(u: Usuario, accion: 'desactivar' | 'reactivar') {
    this.usuarioAccion = u;
    this.accion = accion;
    this.cdr.detectChanges();
  }

  cancelarAccion() {
    this.usuarioAccion = null;
    this.cdr.detectChanges();
  }

  ejecutarAccion() {
    if (!this.usuarioAccion) return;
    this.procesando = true;
    this.cdr.detectChanges();

    const req = this.accion === 'desactivar'
      ? this.usuariosService.desactivarUsuario(this.usuarioAccion._id)
      : this.usuariosService.reactivarUsuario(this.usuarioAccion._id);

    req.subscribe({
      next: () => {
        this.procesando = false;
        this.usuarioAccion = null;
        this.cdr.detectChanges();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al procesar acción.';
        this.procesando = false;
        this.usuarioAccion = null;
        this.cdr.detectChanges();
      },
    });
  }

  esMiCuenta(u: Usuario): boolean {
    return this.authService.getUsuario()?.id === u._id;
  }
}