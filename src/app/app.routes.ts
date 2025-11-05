import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test/playground',
    loadComponent: () => import('@features/playground/playground-page').then(p => p.PlaygroundPageComponent),
  },
  {
    path: '',
    redirectTo: 'test/playground',
    pathMatch: 'full',
  },
];
