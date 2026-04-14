import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProductosList } from './features/productos/pages/productos-list/productos-list';
import { ProductosForm } from './features/productos/pages/productos-form/productos-form';
import { CategoriasList } from './features/categorias/pages/categorias-list/categorias-list';
import { StockMovimientos } from './features/stock/pages/stock-movimientos/stock-movimientos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'productos', component: ProductosList },
  { path: 'productos/nuevo', component: ProductosForm },
  { path: 'productos/editar/:id', component: ProductosForm },
  { path: 'categorias', component: CategoriasList },
  { path: 'stock', component: StockMovimientos },
];