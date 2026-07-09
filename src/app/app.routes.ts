import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((component) => component.HomeComponent),
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('./features/learn/learn.component').then((component) => component.LearnComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
