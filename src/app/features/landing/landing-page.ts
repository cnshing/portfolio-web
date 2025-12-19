import { Component } from "@angular/core";
import LandingHeroComponent from "@features/landing/landing-hero-section";
import LandingTransitionComponent from "@features/landing/transition/landing-transition-section";
import LandingAboutMeComponent  from "@features/landing/about-me/landing-about-me-section";
import LandingCareerComponent from "@features/landing/career/landing-career-section";
import LandingSkillsComponent from "@features/landing/skills/landing-skills-section";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [LandingHeroComponent, LandingTransitionComponent, LandingAboutMeComponent, LandingCareerComponent,
  LandingSkillsComponent
  ],
  template: `
  <landing-hero />
  <landing-transition class=""/>
  <landing-about-me/>
  <landing-transition class="scale-y-[-1] scale-x-[-1]"/>
  <landing-career-timeline />
  <landing-skills />
  `,
  host: {
    'class': 'flex flex-col w-full bg-color-page page',
  },
  styles: `

  ::ng-deep .page > :not(landing-transition) > *
    max-width: var(--spacing-max-width)
    padding: var(--spacing-2xl) var(--spacing-lg)
    margin-left: auto
    margin-right: auto
    gap: var(--spacing-xl)
    width: 100%
  `
})
export class LandingPageComponent {

}