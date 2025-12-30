import { Component } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { environment } from '@environments/environment';

/**
 * Landing Advertisement Section
 *
 * @export
 * @class LandingFooterAdComponent
 * @typedef {LandingFooterAdComponent}
 */
@Component({
  selector: 'landing-footer-ad',
  standalone: true,
  providers: [],
  imports: [ZardIconComponent],
  template: `
    <section class="flex flex-wrap justify-between gap-y-sm">
      <div>
        <h4><span class="text-color-accent">Interested</span> in how this portfolio was built?</h4>
        <p>
          All the design files and source code are available
          <a href="{{ projectLink }}">
            <i
              class="inline-block px-3xs text-color-accent"
              z-icon
              zSize="default"
              zType="code"
            ></i>
            <u>here</u>.</a
          >
        </p>
      </div>
      <div class="flex flex-wrap gap-sm *:size-xl">
        <a href="https://linkedin.com/in/{{ linkedin }}">
          <img src="assets/icons/linkedin.svg"
        /></a>
        <a href="https://github.com/{{ github }}">
          <img src="assets/icons/github-mark-white.svg"
        /></a>
      </div>
    </section>
  `,
})
export class LandingFooterAdComponent {
  protected readonly github = environment.githubUsername;

  protected readonly linkedin = environment.linkedinUsername;

  /**
   * A link to the source code of this site.
   *
   * @protected
   * @readonly
   * @type {"https://github.com/cnshing/portfolio-web"}
   */
  protected readonly projectLink = 'https://github.com/cnshing/portfolio-web';
}
