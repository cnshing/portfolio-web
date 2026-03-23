import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';
import { isTouchDevice } from '@shared/utils/accessibility';
/**
 * Portfolio Bento Card.
 *
 * @export
 * @class LandingPortfolioComponent
 * @typedef {LandingPortfolioComponent}
 */
@Component({
  selector: 'landing-portfolio-card',
  standalone: true,
  providers: [],
  imports: [LandingProjectsCardComponent],
  template: `
    <a
      target="_blank"
      rel="noopener noreferrer"
      landing-projects-card
      class="relative border border-color-strong overflow-hidden z-0"
      href="https://github.com/cnshing/portfolio-web"
      (mouseenter)="motorcyclist.play()"
      (focus)="motorcyclist.play()"
    >
      <div
        class="flex flex-col gap-lg text-center p-lg sm:p-xl text-stroke-bg-page h-full items-center justify-center text-stroke-width-[0.001rem]"
      >
        <h3>
          You are

          <span [class]="highlightClasses">here.</span>
        </h3>
        <h4>
          Designed with <span class="text-color-accent">Figma</span>. Built with
          <span class="text-color-accent">Angular</span>.
        </h4>
      </div>
      <video disableRemotePlayback
        #motorcyclist
        [muted]="'muted'"
        [attr.autoplay]="isTouchDevice ? '' : null"
        poster="/assets/videos/motorcyclist@0.5x.avif"
        playsinline
        class="absolute size-full inset-0 -z-[1] rounded-[inherit] object-cover object-[center_25%]"
      > <!-- TODO: Resolve layout shift from poster attribute -->
        <source src="/assets/videos/motorcyclist.webm" type="video/webm" />
      </video>
    </a>
  `,
})
export class LandingPortfolioComponent {
  /**
   * Set of classes to apply a high contrast highlight over text. Created to address accessibility issues from text over a background video.
   *
   * @protected
   * @readonly
   * @type {string}
   */
  protected readonly highlightClasses =
    'rounded-sm px-2xs text-color-accent bg-color-page border border-color-strong';

  protected readonly isTouchDevice = isTouchDevice()
}
