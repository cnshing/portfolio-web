import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';
import { gsap } from 'gsap';
import { progressMonitor, relativeScroll, vibrate } from '@shared/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SafeResourceUrlPipe } from '@shared/utils/sanitizers';
import { Platform, PlatformModule } from '@angular/cdk/platform';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Function factory to flip the vehcile.
 *
 * @param {HTMLElement} element
 * @returns {(direction: 1 | -1) => void} A function to flip the vehcile.
 */
const vehcileFlipper = (element: HTMLElement) => {
  const reverse = gsap.quickSetter(element, 'scaleX', '%');
  const scaleX = gsap.getProperty(element, 'scaleX') as number;

  /**
   *
   * Turns the vehcile.
   * @param {("1" | "-1")} direction 1 for left, -1 for right
   */
  const setDirection = (direction: 1 | -1) => {
    reverse(scaleX * 100 * direction);
  };
  return setDirection;
};

/**
 * When this function is call, make the vehcile vibrate up and down.
 *
 * @param {HTMLElement} element
 * @returns {gsap.core.Tween}
 */
const vibrateVechile = (element: HTMLElement): gsap.core.Tween =>
  gsap.to(element, {
    yPercent: '+=0.5',
    id: 'vibrate',
    ...vibrate(12, -1 / 12),
  });

/**
 * Animate the motorcycle in the Hero Section.
 *
 * @param {HTMLElement} element Element to animate
 * @param {number} [enterDuration=2.5] The time it takes for the motorcycle to enter the hero section.
 * @returns {gsap.Context}
 */
const animateMotorcycle = (element: HTMLElement, enterDuration: number = 2.5): gsap.Context =>
  gsap.context(() => {
    const flipVechile = vehcileFlipper(element);
    const vibrateTween = vibrateVechile(element);
    const transitionFrame = gsap.timeline();

    transitionFrame
      .fromTo(
        element,
        {
          xPercent: 125,
          x: 0,
        },
        {
          xPercent: 0,
          x: 0,
          duration: enterDuration,
          ease: 'rough({strength: 25, template:power1.out, randomize: true})',
          onStart: () => flipVechile(1),
        },
        0
      )
      .add('vehcileEnterDone', '>');

    transitionFrame.call(
      () => {
        vibrateTween.pause();
      },
      undefined,
      '<87.5%'
    );

    let vehicle = {
      started: false,
      startThreshold: 0.25,
    };

    const vehicleDefaults = { ...vehicle };
    const markstartThreshold = progressMonitor({
      [vehicle.startThreshold]: (_) => {
        if (!vehicle.started) {
          vehicle.started = true;
        }
      },
    });

    const triggerConfig: ScrollTrigger.StaticVars = {
      trigger: element,
      start: relativeScroll.start,
      end: () => relativeScroll.start() + Math.max(window.innerHeight, window.innerWidth),
      scrub: 2.5,
      onEnter: () => vibrateTween.play(),
      onUpdate: (self) => {
        markstartThreshold.onUpdate(self);
        flipVechile(self.direction as 1 | -1);
      },
      onLeaveBack: function (self) {
        if (vehicle.started) {
          self.disable(true);
          flipVechile(-1);
          gsap.to(element, {
            xPercent: '-30',
            x: window.innerWidth - element.getBoundingClientRect().left,
            duration: enterDuration,
            overwrite: 'auto',
            ease: 'rough({strength: 25, template:power1.in, randomize: true})',
            onComplete: () => {
              transitionFrame.restart();
            },
          });
        }
      },
      onEnterBack: (self) => {
        self.refresh(); // Re-evaluate `start()` on back
      },
    };
    const scrollVehcile = gsap.timeline({
      scrollTrigger: triggerConfig,
    });
    scrollVehcile.scrollTrigger!.disable();

    const resetScrollVehcile = () => {
      vehicle = vehicleDefaults;
      scrollVehcile.invalidate();
      scrollVehcile.scrollTrigger!.enable();
    };

    transitionFrame.call(
      () => {
        transitionFrame.pause();
        resetScrollVehcile();
        scrollVehcile.to(
          element,
          {
            x: -1 * element.getBoundingClientRect().right,
            id: 'drive',
          },
          0
        );
      },
      undefined,
      'vehcileEnterDone'
    );
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
  imports: [VideoAutoplayDirective, SafeResourceUrlPipe, PlatformModule],
  template: `
    <link rel="preload" as="image" [href]="motorcyclePoster() | sanitizeResourceUrl" fetchpriority="high" />
    @if (isWebkit) {
      <link rel="preload" as="video" [href]="motorcycleSrc() + '.mp4' | sanitizeResourceUrl" />
    }
    @else {
      <link rel="preload" as="video" [href]="motorcycleSrc() + '.webm' | sanitizeResourceUrl"/>
    }
    <video
      class="brightness-75 w-full ml-[50vw] origin-bottom scale-x-[-250%] scale-y-[250%] max-h-[min((100%-var(--spacing-2xl)+4.25%)/2.5,var(--spacing-2xl)*4)] overflow-x-hidden"
      [poster]="motorcyclePoster()"
      disableRemotePlayback
      muted
      playsinline
      loop
      autoplay
      fetchpriority="high"
      #heroMotorcyclist
    >
      <source type="video/quicktime; codecs=hvc1.1.6.H120.b0" [src]="motorcycleSrc() + '.mp4'" />
      <source type="video/webm; codecs=vp09.00.41.08" [src]="motorcycleSrc() + '.webm'" />
    </video>
  `,
  host: {
    class:
      'absolute bottom-0 size-full flex flex-col justify-end pl-lg overflow-x-hidden overflow-y-hidden',
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
      const vehcile = this.video().nativeElement;
      vehcile.load(); // TODO: When possible make a directive to fix Angular video loading with multiple sources
      vehcile.play();
      this.animate.set(animateMotorcycle(vehcile, 2.0));
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
  protected readonly motorcyclePoster = computed(() => this.motorcycleSrc() + '@0.25x.avif');

  protected readonly isWebkit = inject(Platform).WEBKIT
}
