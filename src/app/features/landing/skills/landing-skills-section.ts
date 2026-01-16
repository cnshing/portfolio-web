import { Component, computed, inject, Signal } from '@angular/core';

import { environment } from '@environments/environment';

import {
  LandingSkillCardComponent,
  LandingSkillCardInput,
} from '@features/landing/skills/landing-skills-card';

import { SSGMarkdownParser } from '@features/ssg/services/ssg-markdown-parser.service';
/**
 * Section containing user's career experience.
 *
 * @export
 * @class LandingSkillsComponent
 * @typedef {LandingSkillsComponent}
 */
@Component({
  selector: 'landing-skills',
  standalone: true,
  providers: [],
  imports: [LandingSkillCardComponent],
  template: `
    <section class="flex flex-col gap-2xl">
      <div class="flex flex-wrap gap-x-2xl gap-y-xs justify-between items-center">
        <h1>Skills</h1>
        <p class="max-w-[calc(var(--spacing-line-length)/1.5)] text-pretty">
        Here are the tools I use for development. They include website design, CI/CD pipelines, and hypervisor-based home lab environments.
        </p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,var(--spacing-2xl))] gap-lg justify-evenly">
        @for (skill of skills(); track skill.name) {
        <landing-skill-card
          [name]="skill.name"
          [logoImg]="skill.logoImg"
          [description]="skill.description"
        />
        }
      </div>
    </section>
  `,
})
export default class LandingSkillsComponent {

  /**
   * Helper service required to load career experience content
   *
   * @protected
   * @readonly
   * @type {*}
   */
    protected readonly markdownParser = inject(SSGMarkdownParser);

  /**
   * Parsed content containing the necessary inputs to render `LandingSkillCardInput` components.
   *
   * @protected
   * @readonly
   * @type {Signal<LandingSkillCardInput[]>}
   */
  protected readonly skills: Signal<LandingSkillCardInput[]> = computed(() =>
    environment.landingSkillsContentMDs.map((md) =>
      this.markdownParser.parseMarkdown<LandingSkillCardInput>(md, {
        bodyKey: 'description',
      })
    )
  );
}
