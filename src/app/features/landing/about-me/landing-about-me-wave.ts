import { Component } from '@angular/core';
import {
  OptimizedLottieComponent,
  DeferredLottieComponent,
} from '@shared/components/lottie/lottie.component';

/**
 * Animated Hand Wave component.
 *
 * @export
 * @class LandingAboutMeWaveComponent
 * @typedef {LandingAboutMeWaveComponent}
 */
@Component({
  selector: 'landing-about-me-wave',
  imports: [OptimizedLottieComponent, DeferredLottieComponent],
  template: `
    <deferred-lottie
      class="align-top inline-flex size-[calc(var(--text-2xl)*1.35)]"
      [placeholder]="poster"
      [content]="animation"
    >
    </deferred-lottie>

    <ng-template #poster>
      <img src="/assets/graphics/waving.svg" />
    </ng-template>

    <ng-template #animation>
      <optimized-lottie
        #wave
        src="/assets/graphics/waving.lottie"
        loop
        (mouseenter)="wave.play()"
        (mouseleave)="wave.pause()"
      />
    </ng-template>
  `,
})
export class LandingAboutMeWaveComponent {}
