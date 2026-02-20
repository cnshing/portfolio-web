import { Directive, signal } from '@angular/core';


/**
 * Animated email icon. For this directive to function correctly, you must explicitly pass in `z-icon`'s [zType] binding to this directive's `zType` property.
 *
 * @export
 * @class LandingEmailIconDirective
 * @typedef {LandingEmailIconDirective}
 */
@Directive({
  selector: 'z-icon[animate-email-icon], [z-icon][animate-email-icon]',
  exportAs: 'animateEmailIcon',
  standalone: true,
})
export class LandingEmailIconDirective {

   /**
    * Controller for z-icon.
    *
    * @readonly
    * @type {*}
    */
   readonly zType = signal<'email' | 'emailOpen'>('email');

  /** Displays the email envelope as open. */
  readonly open = (): void => {
    this.zType.set('emailOpen');
  };

  /** Displays the email envelope as closed. */
  readonly close = (): void => {
    this.zType.set('email');
  };
}
