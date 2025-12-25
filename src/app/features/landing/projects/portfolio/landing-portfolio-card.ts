import { Component } from '@angular/core';

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
  imports: [],
  template: `
    <div
      class="relative border border-color-strong rounded-lg overflow-hidden z-0"
      (mouseenter)="motorcyclist.play()"
    >
      <div
        class="flex flex-col gap-lg text-center p-xl text-stroke-bg-page text-stroke-width-[0.001rem]"
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
      <video
        #motorcyclist
        [muted]="'muted'"
        playsinline
        class="absolute inset-0 -z-[1] rounded-[inherit] w-full h-full object-cover object-[center_-5%]"
      >
        <source src="assets/videos/motorcyclist_no_watermark.mp4" type="video/mp4" />
      </video>
    </div>
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
}
