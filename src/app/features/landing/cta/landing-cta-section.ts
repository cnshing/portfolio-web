import { Component } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { environment } from '@environments/environment';
import { LandingEmailIconDirective } from '@features/landing/icons/landing-email-icon.directive';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

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
  imports: [ZardButtonComponent, ZardIconComponent, LandingEmailIconDirective],
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
          <i z-icon animate-email-icon #icon="animateEmailIcon" zSize="lg" [zType]="icon.zType()"></i>
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
