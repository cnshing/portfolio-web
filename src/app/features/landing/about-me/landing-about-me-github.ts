import { Component, viewChild } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import {
  DeferredLottieComponent,
  OptimizedLottieComponent,
} from '@shared/components/lottie/lottie.component';

/**
 * Animated Github Icon
 *
 * @export
 * @class LandingAboutMeGithubComponent
 * @typedef {LandingAboutMeGithubComponent}
 */
@Component({
  selector: 'landing-about-me-github-icon',
  standalone: true,
  imports: [ZardIconComponent, DeferredLottieComponent, OptimizedLottieComponent],
  template: `
    <deferred-lottie
      class="inline-flex align-top size-(--text-xl)"
      [placeholder]="poster"
      [content]="animation"
    >
    </deferred-lottie>

    <ng-template #poster>
      <i z-icon zType="githubICO" zSize="lg"> </i>
    </ng-template>

    <ng-template #animation>
      <optimized-lottie #github src="/assets/icons/github.lottie" loop [speed]="3.0" />
    </ng-template>
  `,
})
export default class LandingAboutMeGithubComponent {
  /**
   * Control playback mechanism for the github animation.
   *
   * @readonly
   * @type {*}
   */
  readonly animation = viewChild<OptimizedLottieComponent>('github');
}
