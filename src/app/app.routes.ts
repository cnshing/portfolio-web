import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'playground',
    loadComponent: () => import('@features/playground/playground-page').then(p => p.PlaygroundPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('@features/landing/landing-page').then(p => p.LandingPageComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('@features/legal/legal-privacy-policy').then(p => p.LegalPrivacyPolicyComponent),
  }
];
