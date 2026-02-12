import { Component } from '@angular/core';
import { environment } from '@environments/environment';

/**
 * Small copyright disclaimer.
 *
 * @export
 * @class LandingFooterDisclaimerComponent
 * @typedef {LandingFooterDisclaimerComponent}
 */
@Component({
  selector: 'landing-footer-disclaimer',
  standalone: true,
  providers: [],
  imports: [],
  template: `
    <section class="text-color-tertiary flex flex-wrap justify-between gap-y-xs">
      <small>Developed by {{ copyrightOwner }} via Angular.</small>
      <small>© {{ copyrightYears }} {{ copyrightOwner }}. All Rights Reserved.</small>
    </section>
  `,
})
export class LandingFooterDisclaimerComponent {
  /**
   * Copyright owner of this site.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly copyrightOwner = environment.name;

  /**
   * Copyright year range.
   *
   * @protected
   * @readonly
   * @type {string}
   */
  protected readonly copyrightYears = `2025-${new Date().getFullYear()}`;
}
