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
  selector: 'landing-about-me-github-icon',
  standalone: true,
  imports: [ZardIconComponent, PreviewLottieComponent, OptimizedLottieComponent],
  template: `
    <lottie-with-poster
      class="inline-flex align-top size-(--text-xl)"
      [poster]="poster"
      [dotLottieTemplate]="animation"
    >
    </lottie-with-poster>

    <ng-template #poster>
      <i z-icon zType="githubICO" zSize="lg"> </i>
    </ng-template>

    <ng-template #animation>
      <optimized-lottie #github src="/assets/icons/github.lottie" loop [speed]="0.9" mode="bounce" />
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
