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
    path: 'buy',
    loadComponent: () => import('./features/buy/buy.component').then((component) => component.BuyComponent),
  },
  {
    path: 'buy/:id',
    loadComponent: () =>
      import('./features/buy/vehicle-detail.component').then(
        (component) => component.VehicleDetailComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
