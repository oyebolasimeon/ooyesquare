import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/shared/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { 
    path: 'voter', 
    loadChildren: () => import('./components/voter/voter.routes').then(m => m.VOTER_ROUTES)
  },
  { path: '**', redirectTo: '/login' }
];
