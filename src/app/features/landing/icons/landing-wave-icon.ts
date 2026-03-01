import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import {
  OptimizedLottieComponent,
  PreviewLottieComponent,
} from '@shared/components/animate/lottie.component';

/**
 * Animated Hand Wave component.
 *
 * @export
 * @class LandingWaveIconComponent
 * @typedef {LandingWaveIconComponent}
 */
@Component({
  selector: 'landing-wave-icon',
  imports: [OptimizedLottieComponent, PreviewLottieComponent],
  template: `
    <lottie-with-poster
      #preview
      [poster]="poster"
      [dotLottieTemplate]="animation"
    >
    </lottie-with-poster>

    <ng-template #poster>
      <img class="size-full" alt="Hand Waving" src="/assets/graphics/waving.svg" />
    </ng-template>

    <ng-template #animation>
      <optimized-lottie
        #wave
        (load)="preview.onLoadShowLottie()"
        src="/assets/graphics/waving.lottie"
        autoplay
        loop
        [speed]="0.75"
      />
    </ng-template>
  `,
})
export class LandingWaveIconComponent {
  /**
   * Control playback mechanism for the animation.
   *
   * @readonly
   * @type {OptimizedLottieComponent}
   */
  readonly wave = viewChild<OptimizedLottieComponent>('wave');

  /**
   * The minimium amount of animation playback on first load, in milliseconds.
   *
   * @readonly
   * @type {*}
   */
  protected readonly initialPlayDuration = 5000


  /**
   * Has this animation been interacted yet?
   *
   * @protected
   * @readonly
   * @type {boolean}
   */
  protected readonly interacted = signal<boolean>(false)

  protected readonly destroyRef = inject(DestroyRef);

  /**
   * Disables autoplay to let users interact with the animation manually
   *
   * @constructor
   */
  constructor() { // TODO: This code couples special playback behavior to all instances of `LandingWaveIconComponent`. Figure out a way to parameterize this
    const timeoutId = window.setTimeout(() => {
      if (!this.interacted()) {
        this.pause()
      }

    }, this.initialPlayDuration);

    this.destroyRef.onDestroy(() => {
      clearTimeout(timeoutId);
    });
  }

  readonly play = () => {
    this.interacted.set(true)
    this.wave()?.play()

  }

  readonly pause = () => {
    this.wave()?.pause()
  }


  /** Standard video play/pause button mechanism. */
  readonly flip = () => {
    if (!this.wave()?.isPlaying || this.wave()?.isPaused) {
      this.wave()?.play()
    }
    else {
      this.pause()
    }
  }

}
