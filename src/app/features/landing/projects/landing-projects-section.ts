import { Component } from '@angular/core';

import { LandingSlugSchedulerComponent } from './slugscheduler/landing-slugscheduler-card';
import { LandingPortfolioComponent } from './portfolio/landing-portfolio-card';

/**
 * Section containing user's portfolio projects as a bento grid.
 *
 * @export
 * @class LandingProjectsComponent
 * @typedef {LandingProjectsComponent}
 */
@Component({
  selector: 'landing-projects',
  standalone: true,
  providers: [],
  imports: [LandingSlugSchedulerComponent, LandingPortfolioComponent],
  template: `
    <section class="flex flex-col gap-2xl">
      <h1 class="text-center">
        Building’s what I always do.
        <br />
        Check out my <span class="text-color-accent">Portfolio Highlights</span>.
      </h1>
      <div class="flex flex-wrap gap-lg">
        <landing-slugscheduler-card/>
        <landing-portfolio-card />
      </div>
    </section>
  `,
})
export default class LandingProjectsComponent {}
