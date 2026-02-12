import { Component } from '@angular/core';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { LandingNavGroupComponent } from '@features/landing/footer/landing-footer-nav-group';
import { environment } from '@environments/environment';

/**
 * Landing Navigation Links.
 *
 * @export
 * @class LandingFooterNavComponent
 * @typedef {LandingFooterNavComponent}
 */
@Component({
  selector: 'landing-footer-nav',
  standalone: true,
  providers: [],
  imports: [ZardDividerComponent, LandingNavGroupComponent],
  template: `
    <z-divider zSpacing="xl" />
    <div
      class="flex flex-wrap justify-between gap-xl [&_a]:inline-block [&_a]:w-min *:focus-visible:outline-none"
    >
      <address>
        <landing-nav-group title="Contact">
          <li>
            <a target="_blank" rel="noopener noreferrer" href="tel:{{ phone }}">Phone</a>
          </li>
          <li>
            <a target="_blank" rel="noopener noreferrer" href="mailto:{{ email }}">Email</a>
          </li>
        </landing-nav-group>
      </address>
      <landing-nav-group title="About Me">
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
            >Resume Download</a
          >
        </li>
      </landing-nav-group>
      <landing-nav-group title="Legal Information">
        <li>
          <a target="_blank" rel="noopener noreferrer" href="/privacy">Privacy Policy</a>
        </li>
      </landing-nav-group>
      <landing-nav-group title="Miscellaneous">
        <li>
          <a target="_blank" rel="noopener noreferrer" href="/playground">UI Components</a>
        </li>
      </landing-nav-group>
    </div>
  `,
})
export class LandingFooterNavComponent {
  /**
   * `href` resume download link.
   *
   * @protected
   * @readonly
   * @type {*}
   */

  protected readonly name = environment.name;
  protected readonly phone = environment.phoneNumber;
  protected readonly email = environment.email;
}
