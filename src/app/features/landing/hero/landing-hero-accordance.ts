import { afterNextRender, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

/**
 * Scroll Hint with basic opacity trigger and idle detection.
 *
 * @export
 * @class LandingHeroAccordanceComponent
 * @typedef {LandingHeroAccordanceComponent}
 */
@Component({
  selector: 'landing-hero-accordance',
  imports: [ZardIconComponent],
  template: `
    <z-icon data-motorcycle class="" zType="motorcycle" />
    <z-icon data-arrow class="-mb-1/4" zType="caretDown" />
  `,
  host: {
    '[class.opacity-0]':"!isIdled()",
    '[class.!duration-0]':"!hasScrolled() && !isIdled()",
    '[class.opacity-100]': "isIdled()"
  },
})
export class LandingHeroAccordanceComponent {
  /**
   * Has it exceeded the idle timeout?
   *
   * @readonly
   * @type {boolean}
   */
  readonly isIdled = signal<boolean>(false);

  /**
   * How long it takes to be considered "idle" in milliseconds.
   *
   * @readonly
   * @type {number}
   */
  readonly idleTimeoutMS = input<number>(5000);

  /**
   * Has the user scrolled, ever?
   *
   * @readonly
   * @type {boolean}
   */
  readonly hasScrolled = signal<boolean>(false)

  protected readonly scrollMoved = () => {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID)
    }
    this.hasScrolled.set(true)
    this.isIdled.set(false)
  }

  /**
   * Reference to idle detection
   *
   * @protected
   * @type {(undefined | ReturnType<typeof setTimeout>)}
   */
  protected timeoutID: undefined | ReturnType<typeof setTimeout>; // From https://stackoverflow.com/a/76921606

  constructor() {
    afterNextRender(() => {
      window.addEventListener('scroll', this.scrollMoved, { once: true}) // NOTE: Use `addEventListener` instead of native angular scorll host binding for `once` option - scroll listener should not be active after the user no longer needs scroll affordance

      this.timeoutID = setTimeout(() => {
        this.isIdled.set(true);
      }, this.idleTimeoutMS());

    });

    inject(DestroyRef).onDestroy(() => {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
      window.removeEventListener('scroll', this.scrollMoved)
    })
  }
}
