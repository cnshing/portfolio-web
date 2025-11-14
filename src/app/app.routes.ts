import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test/playground',
    loadComponent: () => import('@features/playground/playground-page').then(p => p.PlaygroundPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('@features/landing/landing-page').then(p => p.LandingPageComponent)
  },
];
