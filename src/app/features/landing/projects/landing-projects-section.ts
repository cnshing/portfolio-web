import { Component } from '@angular/core';

import { LandingSlugSchedulerComponent } from '@features/landing/projects/slugscheduler/landing-slugscheduler-card';
import { LandingPortfolioComponent } from '@features/landing/projects/portfolio/landing-portfolio-card';
import { LandingCodeLANComponent } from "@features/landing/projects/codelan/landing-codelan-card";
import { LandingLinuxComponent } from "@features/landing/projects/linux/landing-linux-card";
import { LandingSnoospoofComponent } from '@features/landing/projects/snoospoof/landing-snoospoof-card';


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
  imports: [LandingSlugSchedulerComponent, LandingPortfolioComponent, LandingCodeLANComponent, LandingLinuxComponent, LandingSnoospoofComponent],
  template: `
    <section class="flex flex-col gap-2xl">
      <h1 class="text-center">
        Building’s what I always do.
        <br />
        Check out my <span class="text-color-accent">Portfolio Highlights</span>.
      </h1>
      <div class="bento">
        <landing-snoospoof-card class="[grid-area:snoo]"/>
        <landing-slugscheduler-card class="[grid-area:slug]"/>
        <landing-portfolio-card class="[grid-area:port]"/>
        <landing-codelan-card class="[grid-area:code]"/>
        <landing-linux-card class="[grid-area:linu]" />
      </div>
    </section>
  `,
  styles: `
  .bento
    display: grid
    gap: var(--spacing-lg)
    grid-template-columns: 3fr 2.5fr 1.65fr
    grid-template-rows: 1fr 1.25fr 1.25fr
    grid-template-areas: (
      "snoo port port"
      "snoo slug code"
      "snoo slug linu"
    )

  @media (max-width: 94rem)
    .bento
      grid-template-columns: 1fr 1fr
      grid-template-rows: auto
      grid-template-areas: (
        "snoo port"
        "snoo port"
        "snoo slug"
        "code linu"
      )

  @media (max-width: 64rem)
    .bento
      grid-template-columns: 1fr
      grid-template-rows: repeat(3, 1fr) repeat(2, 0.425fr) repeat(2, 1fr) 0.5fr 0.5fr
      grid-template-areas: (
        "snoo"
        "snoo"
        "snoo"
        "port"
        "port"
        "slug"
        "slug"
        "code"
        "linu"
      )
  `
})
export default class LandingProjectsComponent {}
