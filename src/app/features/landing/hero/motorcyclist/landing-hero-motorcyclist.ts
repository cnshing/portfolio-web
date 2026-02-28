import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, input, signal, viewChild } from "@angular/core";
import { VideoAutoplayDirective } from "@shared/directives/autoplay.directive";
import { TransparentVideoLinkComponent } from "@shared/directives/link.directive";

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
  imports: [VideoAutoplayDirective, TransparentVideoLinkComponent],
  template: `
    <link selectTransparent rel="preload" as="video" zWebkitSrc="/assets/videos/motorcycle.mp4" zFallbackSrc="/assets/videos/motorcycle.webm" fetchpriority="high"/> <!-- TODO: The following code for rel=preload doesn't work, but rel=prefetch does. Figure out why <link rel=preload> has an invalid href value -->
    <video
      class="brightness-75 w-full ml-[50vw] origin-bottom scale-x-[-250%] scale-y-[250%] max-h-[min((100%-var(--spacing-2xl)+4.25%)/2.5,var(--spacing-2xl)*4)] overflow-x-hidden"
      [poster]="motorcyclePoster()"
      disableRemotePlayback
      muted
      playsinline
      loop
      fetchpriority="high"
      preload='metadata'
      autoplay
      #heroMotorcyclist
      [class.animate-(--animate-motorcyclist-enter)]="!animationModuleReady()"
      [style.animation-composition]="animationModuleReady()? null : 'add'"
    >
      <source type="video/quicktime; codecs=hvc1.1.6.H120.b0" [src]="motorcycleSrc() + '.mp4'" />
      <source type="video/webm; codecs=vp09.00.41.08" [src]="motorcycleSrc() + '.webm'" />
    </video>
  `,
  host: {
    class:
      'absolute bottom-0 size-full flex flex-col justify-end pl-lg overflow-x-hidden overflow-y-hidden',
    '[style.--enter-duration]': "enterDurationSecs()+'s'"
  },
  styleUrl: 'landing-hero-motorcyclist-animation.sass'
})
export class LandingHeroMotorcyclistComponent {
  /**
   * Creates an instance of LandingHeroMotorcyclistComponent and loads animation code.
   *
   * @constructor
   */
  constructor() {
    afterNextRender(async () => {
      const vehcile = this.video().nativeElement;
      vehcile.load(); // TODO: When possible make a directive to fix Angular video loading with multiple sources
      vehcile.play();
      vehcile.addEventListener('animationend', async (event: AnimationEvent) => {
        if (event.animationName === 'motorcyclist-enter') {
          const { animateMotorcycle } = await import('./landing-hero-motorcyclist-animation');
          this.animationModuleReady.set(true);
          this.animate.set(animateMotorcycle(vehcile, this.enterDurationSecs()));
        }
      }, { once: true });

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
  readonly enterDurationSecs = input<number>(2.0)


  /**
   * Is the lazy-loaded animation module ready?
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly animationModuleReady = signal<boolean>(false)

  /**
   * Motorcycle element to animate.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('heroMotorcyclist');

  /**
   * Src string of the motorcycle asset.
   *
   * @protected
   * @readonly
   * @type {str}
   */
  protected readonly motorcycleSrc = signal<string>('/assets/videos/motorcycle');

  /**
   * Src string of the motorcycle image preview.
   *
   * @protected
   * @readonly
   * @type {str}
   */
  protected readonly motorcyclePoster = computed(() => this.motorcycleSrc() + '@0.125x.avif');
}
