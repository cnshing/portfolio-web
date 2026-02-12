import { Component, computed, inject, Signal } from '@angular/core';

import LandingCareerPositionComponent from '@features/landing/career/experience/landing-career-experience';

import { environment } from '@environments/environment';

import { LandingCareerExperienceInput } from '@features/landing/career/experience/landing-career-experience.types';
import { SSGMarkdownParser } from '@features/ssg/services/ssg-markdown-parser.service';
/**
 * Section containing user's career experience.
 *
 * @export
 * @class LandingCareerComponent
 * @typedef {LandingCareerComponent}
 */
@Component({
  selector: 'landing-career-timeline',
  standalone: true,
  providers: [SSGMarkdownParser],
  imports: [LandingCareerPositionComponent],
  template: `
    <section class="flex flex-col">
      <h1 class="text-center lg:-translate-y-1/2">Career Timeline</h1>
      <div class="grid auto-grid-[100%] gap-xl">
        @for (position of positions(); track position.company) {
        <landing-career-position
          [company]="position.company"
          [position]="position.position"
          [summary]="position.summary"
          [skills]="position.skills ?? []"
          [highlights]="position.highlights"
          [from]="position.from"
          [to]="position.to"
          [companyLogoImg]="position.companyLogoImg"
          [aboutURL]="position.aboutURL"
        />
        }
      </div>
    </section>
  `,
})
export default class LandingCareerComponent {
  /**
   * Helper service required to load career experience content
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly markdownParser = inject(SSGMarkdownParser);

  /**
   * Parsed content containing the necessary inputs to render `LandingCareerExperience` components.
   *
   * @protected
   * @readonly
   * @type {Signal<LandingCareerExperienceInput[]>}
   */
  protected readonly positions: Signal<LandingCareerExperienceInput[]> = computed(() =>
    environment.landingCareerContentMDs.map((md) =>
      this.markdownParser.parseMarkdown<LandingCareerExperienceInput>(md, {
        bodyKey: 'highlights',
      })
    )
  );
}
