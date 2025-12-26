import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';

/**
 * CodeLAN Bento Card.
 *
 * @export
 * @class LandingCodeLANComponent
 * @typedef {LandingCodeLANComponent}
 */
@Component({
  selector: 'landing-codelan-card',
  standalone: true,
  providers: [],
  imports: [LandingProjectsCardComponent],
  template: `
    <landing-projects-card
      class="relative border border-color-default z-0 aspect-square"
    >
      <div class="flex flex-col h-full gap-md items-center justify-center p-xl text-center z-0">
        <img class="size-xl" src="assets/icons/vscode.svg" />
        <h3 [class]="headlineGradientClasses">
          Code
          <br />
          via LAN
        </h3>
      </div>
      <video
        autoplay
        muted="muted"
        loop
        playsinline
        class="absolute opacity-20 hover:opacity-45 duration-50 ease-in-out  inset-0 -z-[1] rounded-[inherit] size-full object-cover"
      > <!-- TODO: Fix hover not triggering due to z-index and allow for other events like focus, etc. -->
        <source src="assets/videos/codevialan-preview.mp4" type="video/mp4" />
      </video>
    </landing-projects-card>
  `,
})
export class LandingCodeLANComponent {
  protected readonly headlineGradientClasses =
    'bg-linear-to-b from-text-tertiary from-0% to-text-default to-75% bg-clip-text text-transparent';
}
