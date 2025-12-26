import { Component } from '@angular/core';

import { LandingSlugSchedulerComponent } from '@features/landing/projects/slugscheduler/landing-slugscheduler-card';
import { LandingPortfolioComponent } from '@features/landing/projects/portfolio/landing-portfolio-card';
import { LandingCodeLANComponent } from "@features/landing/projects/codelan/landing-codelan-card";


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
  imports: [LandingSlugSchedulerComponent, LandingPortfolioComponent, LandingCodeLANComponent],
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
        <landing-codelan-card />
      </div>
    </section>
  `,
})
export default class LandingProjectsComponent {}
