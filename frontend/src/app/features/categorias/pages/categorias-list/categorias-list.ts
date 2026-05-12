import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService, Categoria } from '../../../../core/services/categorias.service';

@Component({
  selector: 'app-categorias-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList implements OnInit {
  categorias: Categoria[] = [];
  cargando = true;
  error = '';

  modalAbierto = false;
  esEdicion = false;
  guardando = false;
  form = { nombre: '', descripcion: '' };
  categoriaEditandoId = '';
  formError = '';

  categoriaAEliminar: Categoria | null = null;
  eliminando = false;

  constructor(
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriasService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res.data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar categorías.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalNueva() {
    this.esEdicion = false;
    this.form = { nombre: '', descripcion: '' };
    this.formError = '';
    this.categoriaEditandoId = '';
    this.modalAbierto = true;
    this.cdr.detectChanges();
  }

  abrirModalEditar(cat: Categoria) {
    this.esEdicion = true;
    this.form = { nombre: cat.nombre, descripcion: cat.descripcion };
    this.formError = '';
    this.categoriaEditandoId = cat._id;
    this.modalAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.cdr.detectChanges();
  }

  guardar() {
    this.formError = '';
    if (!this.form.nombre.trim()) {
      this.formError = 'El nombre es obligatorio.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    const req = this.esEdicion
      ? this.categoriasService.actualizarCategoria(this.categoriaEditandoId, this.form)
      : this.categoriasService.crearCategoria(this.form);

    req.subscribe({
      next: () => {
        this.guardando = false;
        this.modalAbierto = false;
        this.cdr.detectChanges();
        this.cargarCategorias();
      },
      error: (err: any) => {
        this.formError = err.error?.message || 'Error al guardar.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }

  confirmarEliminar(cat: Categoria) {
    this.categoriaAEliminar = cat;
    this.cdr.detectChanges();
  }

  cancelarEliminar() {
    this.categoriaAEliminar = null;
    this.cdr.detectChanges();
  }

  eliminar() {
    if (!this.categoriaAEliminar) return;
    this.eliminando = true;
    this.cdr.detectChanges();

    this.categoriasService.eliminarCategoria(this.categoriaAEliminar._id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(
          (c) => c._id !== this.categoriaAEliminar!._id,
        );
        this.categoriaAEliminar = null;
        this.eliminando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Error al eliminar.';
        this.eliminando = false;
        this.categoriaAEliminar = null;
        this.cdr.detectChanges();
      },
    });
  }
}