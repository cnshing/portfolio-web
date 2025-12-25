import { Component } from '@angular/core';

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
  imports: [],
  template: `
    <div class="bg-white-0 rounded-lg overflow-hidden max-w-[calc(var(--spacing-3xl)*2)]" >
      <div class="flex flex-col items-center gap-lg pt-xl pb-[calc(var(--spacing-xl)-1.5rem)] px-xl ">
      <img class="w-[calc(var(--spacing-2xl)*2.5)]" src="assets/icons/slugscheduler-logo.png" alt="SlugScheduler Logo"/>
      <p class="text-gray-700 text-center max-w-line-length">Natural Evolution-driven college plan generator</p>
      </div>
      <img class="w-full -mb-[7.5%] brightness-[98.5%]" src="assets/graphics/class-schedule-cropped.png" alt="SlugScheduler Schedule Preview" />
    </div>
  `,
})
export class LandingSlugSchedulerComponent {

}
