import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

/**
 * Dynamically retrieves an icon.
 * Modified from https://github.com/ng-icons/ng-icons?tab=readme-ov-file#dynamically-loading-icons
 * @param {string} name Filename of the icon.
 * @returns {Observable(string)} SVG string representation of `name`.
 */
const iconLoader = (name: string) => {
  const http = inject(HttpClient);
  return http.get(`/assets/icons/${name}.svg`, { responseType: 'text' });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideNgIconLoader(iconLoader, withCaching())
  ]
};
