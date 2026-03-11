import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { IMAGE_LOADER_PROVIDER } from '@core/providers/image-loader.provider';
import { provideDotLottie } from 'ngx-lottie/dotlottie-web';
import { provideCacheableAnimationLoader } from 'ngx-lottie';
import { provideNgtRenderer } from 'angular-three/dom';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    IMAGE_LOADER_PROVIDER,
    provideCacheableAnimationLoader(),
    provideDotLottie({
      player: () => import('@lottiefiles/dotlottie-web').then((m) => m.DotLottie),
    }),
    provideNgtRenderer()
  ],
};
