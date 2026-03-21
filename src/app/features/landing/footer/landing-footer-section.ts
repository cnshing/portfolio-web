import { Component } from '@angular/core';
import { LandingFooterNavComponent } from '@features/landing/footer/landing-footer-nav';
import { LandingFooterAdComponent } from '@features/landing/footer/landing-footer-ad';
import { LandingFooterDisclaimerComponent } from "./landing-footer-disclaimer";

/**
 * Landing Footer Section.
 *
 * @export
 * @class LandingFooterComponent
 * @typedef {LandingFooterComponent}
 */
@Component({
  selector: 'landing-footer',
  standalone: true,
  providers: [],
  imports: [LandingFooterNavComponent, LandingFooterAdComponent, LandingFooterDisclaimerComponent],
  template: `
    <section class="flex flex-col gap-2xl !pb-sm">
      <landing-footer-nav />
      <landing-footer-ad />
      <landing-footer-disclaimer />
    </section>
  `,
})
export default class LandingFooterComponent {
}
