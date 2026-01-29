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
 * Hacky workaround to only allow forward scrubbing for a timeline.
 *
 *
 * @param {gsap.core.Timeline} timeline A completely paused timeline. The function forces the ScrollTrigger playhead in control of the timeline, so any conflicts will result in unknown behavior.
 * @returns {ScrollTrigger.StaticVars} Overrides `onUpdate()`
 */
export const disableReverseScrub = (timeline: gsap.core.Timeline) => ({
  onUpdate(self: ScrollTrigger) { // From https://gsap.com/community/forums/topic/25050-looking-for-scrolltrigger-equivalent-to-scrollmagics-reverse-false/
    timeline.progress() < self.progress ? timeline.progress(self.progress) : null
  },
})