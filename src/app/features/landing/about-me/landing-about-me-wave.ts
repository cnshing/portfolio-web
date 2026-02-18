import { Component } from '@angular/core';
import {
  OptimizedLottieComponent,
  PreviewLottieComponent,
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
  imports: [OptimizedLottieComponent, PreviewLottieComponent],
  template: `
    <lottie-with-poster
      class="align-top inline-flex size-[calc(var(--text-2xl)*1.35)]"
      [poster]="poster"
      [dotLottieTemplate]="animation"
    >
    </lottie-with-poster>

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
