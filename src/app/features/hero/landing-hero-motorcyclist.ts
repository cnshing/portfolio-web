import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';
import { gsap } from 'gsap';
import { relativeScroll, TimelineScrollTrigger, vibrate } from '@shared/utils/gsap';

/**
 * Animate the motorcycle in the Hero Section.
 *
 * @param {HTMLElement} element Element to animate
 * @param {number} [enterDuration=2.5] The time it takes for the motorcycle to enter the hero section.
 * @returns {gsap.Context}
 */
const animateMotorcycle = (element: HTMLElement, enterDuration: number =2.5): gsap.Context => gsap.context(() => {
  const animation = gsap.timeline();

  animation.from(
    element,
    {
      xPercent: 125,
      duration: enterDuration,
      ease: 'rough({strength: 25, template:power1.out, randomize: true})',
    },
    0
  );

  animation.add('vehcileEnterDone', '>');
  animation.to(element, { yPercent: '+=0.5', ...vibrate(12, 0.875 * enterDuration) }, 0);

  const triggerConfig: ScrollTrigger.StaticVars = {
    trigger: element,
    ...relativeScroll,
    scrub: 5,
    onEnterBack: () => {
      ScrollTrigger.refresh(); // Re-evaluate `start()` on back
    },
  }

  const scrollTriggerTL = TimelineScrollTrigger(animation)

  scrollTriggerTL.to(element, {
    xPercent: -102.5,
    x: '-100vw',
    scrollTrigger: triggerConfig
  }, 'vehcileEnterDone')


  scrollTriggerTL.to(element,
    {
      yPercent: '+=0.5',
      scrollTrigger: triggerConfig,
      ...vibrate(12, 12)
    },
    'vehcileEnterDone'
  )
});
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
  imports: [VideoAutoplayDirective],
  template: `
    <video
      src="assets/videos/motorcycleman/test_motorcycle_idle_flipped.webm"
      class="brightness-75 w-full ml-[50vw] origin-bottom scale-[250%] max-h-[min((100%-var(--spacing-2xl)+4.25%)/2.5,var(--spacing-2xl)*4)] overflow-x-hidden"
      disableRemotePlayback
      muted
      playsinline
      loop
      autoplay
      #heroMotorcyclist
    >
      <source
        type="video/quicktime; codecs=hvc1.1.6.H120.b0"
        src="assets/videos/motorcycleman/test_motorcycle_idle_flipped.webm"
      />
    </video>
  `,
  host: {
    class: 'absolute bottom-0 size-full flex flex-col justify-end pl-lg',
  },
})
export class LandingHeroMotorcyclistComponent {
  /**
   * Creates an instance of LandingHeroMotorcyclistComponent and loads animation code.
   *
   * @constructor
   */
  constructor() {
    afterNextRender(() => {
      this.animate.set(animateMotorcycle(this.video().nativeElement));
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
  protected readonly animate = signal<gsap.Context | null>(null);

  /**
   * Motorcycle element to animate.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('heroMotorcyclist');
}
