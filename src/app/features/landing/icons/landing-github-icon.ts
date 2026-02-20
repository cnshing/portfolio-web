import { Component, viewChild } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import {
  PreviewLottieComponent,
  OptimizedLottieComponent,
} from '@shared/components/lottie/lottie.component';

/**
 * Animated Github Icon
 *
 * @export
 * @class LandingGithubIconComponent
 * @typedef {LandingGithubIconComponent}
 */
@Component({
  selector: 'landing-github-icon',
  standalone: true,
  imports: [ZardIconComponent, PreviewLottieComponent, OptimizedLottieComponent],
  template: `
    <lottie-with-poster
      #preview
      [poster]="poster"
      [dotLottieTemplate]="animation"
    >
    </lottie-with-poster>

    <ng-template #poster>
      <i z-icon zType="githubICO"> </i>
    </ng-template>

    <ng-template #animation>
      <optimized-lottie #github (load)="preview.onLoadShowLottie()" src="/assets/icons/github.lottie" loop [speed]="0.9" mode="reverse-bounce" />
    </ng-template>
  `,
})
export class LandingGithubIconComponent {
  /**
   * Control playback mechanism for the github animation.
   *
   * @readonly
   * @type {*}
   */
  readonly animation = viewChild<OptimizedLottieComponent>('github');
}
