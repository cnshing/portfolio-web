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
import { relativeScroll, vibrate } from '@shared/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger)

/**
 * Animate the motorcycle in the Hero Section.
 *
 * @param {HTMLElement} element Element to animate
 * @param {number} [enterDuration=2.5] The time it takes for the motorcycle to enter the hero section.
 * @returns {gsap.Context}
 */
const animateMotorcycle = (element: HTMLElement, enterDuration: number =2.5): gsap.Context => gsap.context(() => {

  const reverse = gsap.quickSetter(element, "scaleX", "%")
  const scaleX = gsap.getProperty(element, "scaleX") as number
  const setDirection = (direction: 1 | -1) => {
    reverse(scaleX*100*direction)
  }

  const transitionFrame = gsap.timeline();

  transitionFrame.call(() => {
    setDirection(1)
  }, undefined, 0)
  transitionFrame.fromTo(
    element,
    {
      xPercent:125,
      x: 0
    },
    {
      xPercent:0,
      x: 0,
      duration: enterDuration,
      ease: 'rough({strength: 25, template:power1.out, randomize: true})',
    },
    0
  ).add('vehcileEnterDone', '>');

  const vibrateTween = gsap.to(element, { yPercent: '+=0.5', id: "vibrate", ...vibrate(12, -1/12) })

  transitionFrame.call(() => {vibrateTween.pause()}, undefined, "<87.5%")

  let scrollVehcile: gsap.core.Timeline;
  let isLeaving = false;
  const triggerConfig: ScrollTrigger.StaticVars = {
    trigger: element,
    ...relativeScroll,
    markers: true,
    scrub: 5,
    onEnter: () => vibrateTween.play(),
    onUpdate: (self) => {
      if (!isLeaving) {
        setDirection(self.direction as 1 | -1)
      }
    },
    onLeaveBack: (self) => {
      isLeaving = true
      scrollVehcile.pause()
      self.disable(true)
      gsap.to(
        element,
        {
          xPercent: 75,
          duration: enterDuration*1.3,
          overwrite: 'auto',
          ease: 'rough({strength: 25, template:power1.in, randomize: true})',
          onComplete: () => {transitionFrame.restart()}
        }

      )
    },
    onEnterBack: () => {
      ScrollTrigger.refresh(); // Re-evaluate `start()` on back
    },
  }

  transitionFrame.call(() => {
    scrollVehcile = gsap.timeline({
      scrollTrigger: triggerConfig
    })
    isLeaving = false
    scrollVehcile.to(
      element, {
        xPercent: -102.5,
        x: '-100vw',
        ease: 'rough({strength: 25, template:power1.out, randomize: true})'},
        0
    )
    scrollVehcile.scrollTrigger!.enable()
    transitionFrame.pause()
  },undefined,'vehcileEnterDone')

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
