import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LandingMotorcyclistSceneComponent } from './landing-hero-motorcyclist-scene';

/**
 * Motorcyclist element with built-in animations.
 *
 * @export
 * @class LandingHeroMotorcyclistComponent
 * @typedef {LandingHeroMotorcyclistComponent}
 */
@Component({
  selector: 'landing-hero-motorcyclist',
  standalone: true,
  imports: [NgOptimizedImage, LandingMotorcyclistSceneComponent],
  template: `
    <div
      class="relative size-full origin-center overflow-x-visible ml-[50vw] flex flex-col justify-end items-center"
      #scrollHero
      [class.animate-(--animate-motorcyclist-enter)]="!animationModuleReady()"
      [style.animation-composition]="animationModuleReady() ? null : 'add'"
    >
      <!-- NOTE: The CSS is very brittle. You must ensure the placeholder's brightness, layout, and sizing is visually identical to the  the three.js's world equivalent.-->
      @defer (on immediate) {

      <landing-hero-motorcyclist-scene
        class="h-full w-[calc(100%+100rem)] mt-[4.25%] max-h-[calc(var(--spacing-2xl)*10)]"
      />
      } @placeholder {
      <img
        class="brightness-59 origin-bottom object-contain  scale-x-[-250%] scale-y-[250%] max-h-[min((100%-var(--spacing-2xl)+17%)/2.5,var(--spacing-2xl)*4)]"
        ngSrc="/assets/videos/motorcycle.png"
        [loaderParams]="{ baseWidth: 3840, stepDownOffset: 1 }"
        width="3840"
        height="2112"
        sizes="auto"
        decoding="async"
        alt="Motorcyclist"
        priority
      />
      }
    </div>
  `,
  host: {
    '[style.--enter-duration]': 'enterDurationSecs()', // Value must be unitless due to CSS animation implementation
    class: 'overflow-x-hidden overflow-y-hidden',
  },
  styleUrl: 'landing-hero-motorcyclist-animation.sass',
})
export class LandingHeroMotorcyclistComponent {
  /**
   * Creates an instance of LandingHeroMotorcyclistComponent and loads animation code.
   *
   * @constructor
   */
  constructor() {
    afterNextRender(async () => {
      const vehcile = this.motorcyclist().nativeElement;
      vehcile.addEventListener(
        'animationend',
        async (_: AnimationEvent) => {
          // NOTE: Event data in Safari only has `isTrusted` property
          const { animateMotorcycle } = await import('./landing-hero-motorcyclist-animation');
          this.animationModuleReady.set(true);
          this.animate.set(animateMotorcycle(vehcile, this.enterDurationSecs()));
        },
        { once: true }
      );

      // Start loading the animation module (will be cached for later use)
      await import('./landing-hero-motorcyclist-animation');
    });

    inject(DestroyRef).onDestroy(() => this.animate()?.revert()); // Do not evalute this.animate() directly
  }

  /**
   * Animation container.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly animate = signal<any>(null);

  /**
   * How long does it take for the motorcycle to enter in seconds?
   *
   * @readonly
   * @type {*}
   */
  readonly enterDurationSecs = input<number>(2.0);

  /**
   * Is the lazy-loaded animation module ready?
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly animationModuleReady = signal<boolean>(false);

  /**
   * Motorcycle element to animate.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly motorcyclist = viewChild.required<ElementRef<HTMLElement>>('scrollHero');
}
