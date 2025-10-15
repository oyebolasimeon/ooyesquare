import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // TODO: Create these components
  // { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  // { path: 'positions', loadComponent: () => import('./positions/positions.component').then(m => m.PositionsComponent) },
  // { path: 'contestants', loadComponent: () => import('./contestants/contestants.component').then(m => m.ContestantsComponent) },
  // { path: 'voters', loadComponent: () => import('./voters/voters.component').then(m => m.VotersComponent) },
  // { path: 'elections', loadComponent: () => import('./elections/elections.component').then(m => m.ElectionsComponent) },
  // { path: 'results', loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent) },
];

