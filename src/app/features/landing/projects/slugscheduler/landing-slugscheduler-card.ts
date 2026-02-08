import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';
import { NgOptimizedImage } from '@angular/common';
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
  imports: [LandingProjectsCardComponent, NgOptimizedImage],
  template: `
    <a
      landing-projects-card
      class="bg-white-0 overflow-hidden flex flex-col"
      href="https://github.com/yang0613/Ultimate-Course-Scheduler"
    >
      <div
        class="flex flex-col items-center gap-lg pt-xl pb-[calc(var(--spacing-xl)-1.5rem)] px-lg sm:px-xl "
      >
        <img
          class="relative w-[max(62.5%,var(--spacing-2xl)*2.5)]"
          ngSrc="/assets/icons/slugscheduler-logo.png"
          [loaderParams]="{baseWidth: 1552}"
          width="1552"
          height="780"
          sizes="auto"
          loading="auto"
          decoding="async"
          alt="SlugScheduler Logo"
        />
        <p class="text-gray-700 text-center max-w-line-length">
          Natural Evolution-driven college plan generator
        </p>
      </div>
      <div class="flex-1">
        <img
          class="size-full object-cover object-left-top translate-y-[8%] brightness-[98.5%]"
          ngSrc="/assets/graphics/class-schedule-cropped.png"
          sizes="auto"
          [loaderParams]="{baseWidth: 886}"
          alt="SlugScheduler Schedule Preview"
          width="886"
          height="879"
          loading="auto"
          decoding="async"
        />
      </div>
    </a>
  `,
})
export class LandingSlugSchedulerComponent {}
