import { Component, WritableSignal, signal } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

/**
 * Animated email icon.
 *
 * @export
 * @class LandingAboutMeEmailComponent
 * @typedef {LandingAboutMeEmailComponent}
 */
@Component({
  selector: 'landing-about-me-email-icon',
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <i
      z-icon
      zSize="lg"
      [zType]="iconType()"
    >
      <ng-content></ng-content>
    </i>
  `,
  styles: ``
})
export default class LandingAboutMeEmailComponent {


  /**
   * Internal icon state.
   *
   * @protected
   * @readonly
   * @type {WritableSignal<"email" | "emailOpen">}
   */
  protected readonly iconType: WritableSignal<"email" | "emailOpen"> = signal('email');


  /** Makes the email envelope open. */
  readonly open = (): void => {
    this.iconType.set('emailOpen');
  };

  /** Makes the email envelope closed. */
  readonly close = (): void => {
    this.iconType.set('email');
  };
}
