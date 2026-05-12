import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProductosList } from './features/productos/pages/productos-list/productos-list';
import { ProductosForm } from './features/productos/pages/productos-form/productos-form';
import { CategoriasList } from './features/categorias/pages/categorias-list/categorias-list';
import { StockMovimientos } from './features/stock/pages/stock-movimientos/stock-movimientos';
import { Reportes } from './pages/reportes/reportes';
import { UsuariosList } from './features/usuarios/pages/usuarios-list/usuarios-list';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard',         component: Dashboard,       canActivate: [authGuard] },
  { path: 'productos',         component: ProductosList,   canActivate: [authGuard] },
  { path: 'productos/nuevo',   component: ProductosForm,   canActivate: [authGuard] },
  { path: 'productos/editar/:id', component: ProductosForm, canActivate: [authGuard] },
  { path: 'categorias',        component: CategoriasList,  canActivate: [authGuard] },
  { path: 'stock',             component: StockMovimientos, canActivate: [authGuard] },
  { path: 'reportes',          component: Reportes,        canActivate: [adminGuard] },
  { path: 'usuarios',          component: UsuariosList,    canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' },
];