import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * @param {number} frequency Frequency of vibration
 * @param {number} duration Duration of vibration
 * @returns {gsap.TweenVars}  Tween configuration to make an animation go back and forth.
 */
export const vibrate = (frequency: number, duration: number) => ({
  duration: 1 / frequency,
  ease: 'rough({strength: 10, template: bounce.out})',
  repeat: duration * frequency,
  yoyo: true,
});

/**
 * Forces the trigger to be relative to the viewport, starting at the current vertical scroll position and ending at the bottom of the viewport.
 *
 * @type {ScrollTrigger.StaticVars} Overrides `start` and `end` values.
 */
export const relativeScroll = {
  start: () => window.pageYOffset,
  end: () => window.pageYOffset + window.innerHeight,
};

/**
 * Workaround-helper for position-aware scrollTriggers.
 *
 * @param {gsap.core.Timeline} timeline An existing timeline
 */
export const TimelineScrollTrigger = (timeline: gsap.core.Timeline) => {
  gsap.registerPlugin(ScrollTrigger);
  return {
    /**
     * Identical to timeline's `to()`, except the scroll trigger will not initialize until `position`.
     *
     */
    to(targets: gsap.TweenTarget, vars: gsap.TweenVars, position?: gsap.Position) {
      timeline.call(
        () => {
          const { scrollTrigger, ...tweenVars } = vars;
          ScrollTrigger.create({
            ...(scrollTrigger ?? {}),
            animation: gsap.to(targets, tweenVars),
          });
        },
        undefined,
        position
      );
    },
  };
};
