import { Component } from "@angular/core";
import LandingHeroComponent from "@features/hero/landing-hero-section";
import { LandingTransitionRacetrackComponent, LandingTransitionHelmetComponent } from "@features/landing/transition/landing-transition-section";
import LandingAboutMeComponent  from "@features/landing/about-me/landing-about-me-section";
import LandingCareerComponent from "@features/landing/career/landing-career-section";
import LandingSkillsComponent from "@features/landing/skills/landing-skills-section";
import LandingProjectsComponent from "@features/landing/projects/landing-projects-section";
import LandingFooterComponent from "@features/landing/footer/landing-footer-section";
import LandingCTAComponent from "@features/landing/cta/landing-cta-section";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [LandingHeroComponent, LandingTransitionRacetrackComponent, LandingAboutMeComponent, LandingCareerComponent,
    LandingSkillsComponent, LandingProjectsComponent, LandingFooterComponent, LandingCTAComponent, LandingTransitionHelmetComponent],
  template: `
  <landing-hero class="min-h-[102.5lvh] max-h-[calc(var(--spacing-3xl)*10)] "/> <!-- Extra 2.5dvh due to y-overflow from landing-transition-racetrack, max-height restriction for zoomed-out views -->
  <landing-transition-racetrack/>
  <landing-about-me/>
  <landing-transition-racetrack class="scale-y-[-1] scale-x-[-1]"/>
  <landing-career-timeline />
  <landing-skills />
  <landing-transition-helmet />
  <landing-projects/>
  <landing-cta/>
  <landing-footer/>
  `,
  host: {
    'class': 'flex flex-col w-full bg-color-page landing-page',
  },
  styles: `
  .landing-page > :not(landing-transition-helmet, landing-transition-racetrack) > :first-child // NOTE: This fixes any landing sections with multiple siblings
    max-width: var(--spacing-max-width)
    padding: var(--spacing-2xl) var(--spacing-lg)
    margin-left: auto
    margin-right: auto
    gap: var(--spacing-2xl)
    width: 100%
  `
})
export class LandingPageComponent {

}