import { gsap } from 'gsap';
import { progressMonitor, relativeScroll, vibrate } from '@shared/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Function factory to flip the vehcile.
 *
 * @param {HTMLElement} element
 * @returns {(direction: 1 | -1) => void} A function to flip the vehcile.
 */
export const vehcileFlipper = (element: HTMLElement) => {
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
export const vibrateVechile = (element: HTMLElement): gsap.core.Tween =>
  gsap.to(element, {
    yPercent: '+=0.5',
    id: 'vibrate',
    ...vibrate(12, -1 / 12),
  });

/**
 * Animate the motorcycle in the Hero Section.
 *
 * @param {HTMLElement} element Element to animate
 * @param {number} enterDuration The time it takes for the motorcycle to enter the hero section.
 * @returns {gsap.Context}
 */
export const animateMotorcycle = (element: HTMLElement, enterDuration: number): gsap.Context =>
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

    transitionFrame.seek("vehcileEnterDone-=0.01%", false) // vehcileEnter animation on first load needs to be skipped due to functionally equivalent CSS animation in `landing-hero-motorcyclist-animation.sass`

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
      ...relativeScroll(() => Math.max(window.innerHeight, window.innerWidth)),
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
