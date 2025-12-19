import { Component, computed, Signal } from '@angular/core';

import { environment } from '@environments/environment';

import {
  LandingSkillCardComponent,
  LandingSkillCardInput,
} from '@features/landing/skills/landing-skills-card';
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
        <p>Here are all the tools I use for development.</p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,var(--spacing-2xl))] gap-lg justify-between">
        @for (skill of skills(); track skill.name) {
        <landing-skill-card
          [name]="skill.name"
          [skillImg]="skill.skillImg"
          [description]="skill.description"
        />
        }
      </div>
    </section>
  `,
})
export default class LandingSkillsComponent {
  protected readonly skills: Signal<LandingSkillCardInput[]> = computed(
    () => environment.landingSkillsContent
  );
}
