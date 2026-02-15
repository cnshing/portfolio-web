import { Component, NgZone } from "@angular/core";
import { DotLottieWorker } from '@lottiefiles/dotlottie-web'
import { DotLottieWorkerComponent } from 'ngx-lottie/dotlottie-web'

/**
 * Animated Hand Wave component.
 *
 * @export
 * @class LandingAboutMeWaveComponent
 * @typedef {LandingAboutMeWaveComponent}
 */
@Component({
  selector: 'landing-about-me-wave',
  imports: [
    DotLottieWorkerComponent
  ],
  template: `
    <ng-dotlottie-worker
      src="/assets/graphics/waving.lottie"
      loop
      (dotLottieCreated)="onCreated($event)"
      (mouseover)="this.play()"
      (mouseleave)="this.pause()"
    />
  `
})
export class LandingAboutMeWaveComponent {
  // Optimizations from https://github.com/ngx-lottie/ngx-lottie/blob/master/docs/ngx-lottie.md#optimizations

  protected dotLottie: DotLottieWorker | null = null;

  constructor(private ngZone: NgZone) {}

  onCreated(dotLottie: DotLottieWorker): void {
    this.dotLottie = dotLottie;
  }

  /** Plays animation. */
  play(): void {
    this.ngZone.runOutsideAngular(() => {
      this.dotLottie?.play();
    });
  }

  /** Pauses animation. */
  pause(): void {
    this.ngZone.runOutsideAngular(() => {
      this.dotLottie?.pause();
    });
  }
}