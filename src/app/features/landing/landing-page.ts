import { Component, inject, signal } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import LandingHeroComponent from '@features/landing/hero/landing-hero-section';
import {
  LandingTransitionRacetrackComponent,
  LandingTransitionHelmetComponent,
} from '@features/landing/transition/landing-transition-section';
import LandingAboutMeComponent from '@features/landing/about-me/landing-about-me-section';
import LandingCareerComponent from '@features/landing/career/landing-career-section';
import LandingSkillsComponent from '@features/landing/skills/landing-skills-section';
import LandingProjectsComponent from '@features/landing/projects/landing-projects-section';
import LandingFooterComponent from '@features/landing/footer/landing-footer-section';
import LandingCTAComponent from '@features/landing/cta/landing-cta-section';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [
    LandingHeroComponent,
    LandingTransitionRacetrackComponent,
    LandingAboutMeComponent,
    LandingCareerComponent,
    LandingSkillsComponent,
    LandingProjectsComponent,
    LandingFooterComponent,
    LandingCTAComponent,
    LandingTransitionHelmetComponent,
    PlatformModule,
  ],
  template: `
    <main class="flex flex-col w-full bg-color-page landing-page">
      <landing-hero class="min-h-custom-screen max-h-[calc(var(--spacing-3xl)*10)] " />
      <landing-transition-racetrack />
      <landing-about-me />
      <landing-transition-racetrack class="scale-y-[-1] scale-x-[-1]" />
      <landing-career-timeline />
      <landing-skills />
      <landing-transition-helmet />
      <landing-projects />
      <landing-cta />
    </main>
    <footer class="landing-page">
      <landing-footer />
    </footer>
  `,
  host: {
    '[style.--screen-height.px]': 'needsVHFix ? screenHeight()*1.05: undefined', // 5% vh increase to compensate for iOS
    '(window:resize)': 'needsVHFix ? onResize() : undefined',
  },
  styles: `
  .min-h-custom-screen
    min-height: var(--screen-height, 102.5dvh) // Extra 2.5dvh due to y-overflow from landing-transition-racetrack, max-height restriction for zoomed-out views


  ::ng-deep .landing-page > :not(landing-transition-helmet, landing-transition-racetrack) > :first-child // NOTE: This fixes any landing sections with multiple siblings
    max-width: var(--spacing-max-width)
    padding: var(--spacing-2xl) var(--spacing-lg)
    margin-left: auto
    margin-right: auto
    gap: var(--spacing-2xl)
    width: 100%
  `,
})
export class LandingPageComponent {
  readonly platform = inject(Platform);
  readonly needsVHFix =
    this.platform.IOS &&
    (!this.platform.SAFARI || navigator.userAgent.match('CriOS') || this.platform.EDGE); // For certain iOS browsers, scrolling down dynamically changes the viewport(by hiding the tab) resulting in landing-hero's being shifted during scroll, causing a negative experience

  readonly screenHeight = signal<number>(document.documentElement.clientHeight);
  readonly innerWidth = signal<number>(window.innerWidth);
  readonly initialScale = signal<number>(window.visualViewport? window.visualViewport.scale : 1);

  protected readonly onResize = () => {
    if (this.innerWidth() != window.innerWidth && this.initialScale() == window.visualViewport?.scale) { // If the inner width changes but the source of change isn't from a pinch zoom
      this.screenHeight.set(document.documentElement.clientHeight);
      this.innerWidth.set(window.innerWidth);
    }
  };
}
