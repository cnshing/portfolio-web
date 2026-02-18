import { Component } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { environment } from '@environments/environment';
import { LandingAboutMeEmailComponent } from "@features/landing/about-me/landing-about-me-email";

/**
 * Section containing a CTA advertisement.
 *
 * @export
 * @class LandingCTAComponent
 * @typedef {LandingCTAComponent}
 */
@Component({
  selector: 'landing-cta',
  standalone: true,
  providers: [],
  imports: [ZardButtonComponent, LandingAboutMeEmailComponent],
  template: `
    <section>
      <div class="m-auto text-center py-3xl">
        <h1 class="mb-xl">Any questions? I’d be happy to answer any inquiries.</h1>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:{{ email }}"
          z-button
          class="w-min"
          (mouseenter)="icon.open()"
          (mouseleave)="icon.close()"
          (focus)="icon.open()"
          (focusout)="icon.close()"
        >
          <landing-about-me-email-icon #icon />
          {{ email }}
        </a>
      </div>
    </section>
  `,
})
export default class LandingCTAComponent {
  /**
   * Email to send inquiries.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly email = environment.email;
}
