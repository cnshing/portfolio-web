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
 * When users quickly scroll back and fourth near the ScrollTrigger start line with `relativeScroll`, unexpected animation jumping occurs. This function uses a heuristic to pad the starting line to account for scroll speed.
 *
 * @param {ScrollTrigger} self
 * @returns {number}
 */
const safetyScrollThreshold = (self: ScrollTrigger) => Math.abs(self.getVelocity() / 4) + 10; // NOTE: Add 10 pixels on the off chance velocity is zero

/**
 * Forces the trigger to be relative to the viewport, starting at the current vertical scroll position and ending at the bottom of the viewport.
 *
 * @param {(number | (() => number))} [endOffset=() => window.innerHeight] The total scroll length to complete the animation. Can be a direct number or a function returning a number. Defaults to one viewport.
 * @returns {number)) => { start: () => any; end: () => any; }} Overrides `start` and `end` values.
 */
export const relativeScroll = (endOffset: number | (() => number) = () => window.innerHeight) => ({
  start: (self: ScrollTrigger) => {
    return window.scrollY + safetyScrollThreshold(self);
  },
  end: (self: ScrollTrigger) => {
    return (
      window.scrollY +
      safetyScrollThreshold(self) +
      (typeof endOffset === 'number' ? endOffset : endOffset())
    );
  },
});

/**
 * Hacky workaround to only allow forward scrubbing for a timeline.
 *
 *
 * @param {gsap.core.Timeline} timeline A completely paused timeline. The function forces the ScrollTrigger playhead in control of the timeline, so any conflicts will result in unknown behavior.
 * @returns {ScrollTrigger.StaticVars} Overrides `onUpdate()`
 */
export const disableReverseScrub = (timeline: gsap.core.Timeline) => ({
  onUpdate(self: ScrollTrigger) {
    // From https://gsap.com/community/forums/topic/25050-looking-for-scrolltrigger-equivalent-to-scrollmagics-reverse-false/
    timeline.progress() < self.progress ? timeline.progress(self.progress) : null;
  },
});

/**
 * Containing instructions to call function `value` at progress `key`
 *
 * @export
 * @typedef {ProgressCallback}
 */
export type ProgressCallback = {
  [key: number]: (self: ScrollTrigger) => void;
};

/**
 * ScrollTrigger helper to call any arbitrary function whenever the progress of animation passes a certain point.
 *
 * @param {ProgressCallback} onProgress Each key represents a certain progress percentage, that, when passes, calls it's corresponding value as a function.
 * @returns {ScrollTrigger.StaticVars} Overrides `onUpdate()`
 */
export const progressMonitor = (onProgress: ProgressCallback) => {
  const thresholds = Object.keys(onProgress)
    .map(Number)
    .sort((a, b) => a - b);

  let prevProgress = 0;

  return {
    onUpdate(self: ScrollTrigger) {
      for (const threshold of thresholds) {
        const crossedForward = prevProgress < threshold && self.progress >= threshold;

        const crossedBackward = prevProgress > threshold && self.progress <= threshold;

        if (crossedForward || crossedBackward) {
          onProgress[threshold]!(self);
        }
      }

      prevProgress = self.progress;
    },
  };
};
