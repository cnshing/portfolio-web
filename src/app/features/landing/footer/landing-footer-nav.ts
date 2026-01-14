import { Component, computed } from '@angular/core';
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
    <div class="flex flex-wrap justify-between gap-xl">
      <landing-nav-group title="Contact">
        <address>
          <a target="_blank" rel="noopener noreferrer" href="tel:{{ phone }}">
            <li>Phone</li>
          </a>

          <a target="_blank" rel="noopener noreferrer" href="mailto:{{ email }}">
            <li>Email</li>
          </a>
        </address>
      </landing-nav-group>
      <landing-nav-group title="About Me">
        <a target="_blank" rel="noopener noreferrer" [href]="resumeDownload()" download><li>Resume Download</li></a>
      </landing-nav-group>
      <landing-nav-group title="Legal Information">
        <a target="_blank" rel="noopener noreferrer" href="/privacy"><li>Privacy Policy</li></a>
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
  protected readonly resumeDownload = computed(
    () => `resumes/${environment.name.replace(' ', '_')}_Resume.pdf`
  );

  protected readonly phone = environment.phoneNumber;
  protected readonly email = environment.email;
}
