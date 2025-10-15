import { Routes } from '@angular/router';

export const VOTER_ROUTES: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { 
    path: 'categories', 
    loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent) 
  },
  { 
    path: 'states', 
    loadComponent: () => import('./states/states.component').then(m => m.StatesComponent) 
  },
  { 
    path: 'voting', 
    loadComponent: () => import('./voting/voting.component').then(m => m.VotingComponent) 
  },
  { 
    path: 'thank-you', 
    loadComponent: () => import('./thank-you/thank-you.component').then(m => m.ThankYouComponent) 
  },
];
