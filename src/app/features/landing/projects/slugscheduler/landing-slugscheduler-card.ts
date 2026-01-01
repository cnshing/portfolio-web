import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';
/**
 * SlugScheduler Bento Card.
 *
 * @export
 * @class LandingSlugSchedulerComponent
 * @typedef {LandingSlugSchedulerComponent}
 */
@Component({
  selector: 'landing-slugscheduler-card',
  standalone: true,
  providers: [],
  imports: [LandingProjectsCardComponent],
  template: `
    <landing-projects-card class="bg-white-0 overflow-hidden max-w-[calc(var(--spacing-3xl)*2)]">
      <div class="flex flex-col items-center gap-lg pt-xl pb-[calc(var(--spacing-xl)-1.5rem)] px-xl ">
      <img class="w-[calc(var(--spacing-2xl)*2.5)]" src="assets/icons/slugscheduler-logo.png" alt="SlugScheduler Logo"/>
      <p class="text-gray-700 text-center max-w-line-length">Natural Evolution-driven college plan generator</p>
      </div>
      <img class="w-full -mb-[12%] brightness-[98.5%]" src="assets/graphics/class-schedule-cropped.png" alt="SlugScheduler Schedule Preview" />
    <landing-projects-card/>
  `,
})
export class LandingSlugSchedulerComponent {

}
