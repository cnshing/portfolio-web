import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';
import { LandingSnoobotComponent } from '@features/landing/projects/snoospoof/snoobot/landing-snoospoof-snoobot';
/**
 * Snoospoof Bento Card.
 *
 * @export
 * @class LandingSnoospoofComponent
 * @typedef {LandingSnoospoofComponent}
 */
@Component({
  selector: 'landing-snoospoof-card',
  standalone: true,
  providers: [],
  imports: [LandingProjectsCardComponent, LandingSnoobotComponent],
  template: `
    <a
      landing-projects-card
      class="bg-linear-to-b from-bg-surface2 from-0% to-bg-surface1 to-100% overflow-hidden flex flex-col justify-between"
      href="https://snoospoof.app/"
    >
      <div class="flex flex-col gap-md pt-xl px-xl text-left text-xl">
        <h2 class="font-medium text-2xl">
          Talk to and emulate any
          <br />
          <span class="text-[#FF4400] font-semibold">Redditor</span>
        </h2>
        <h3 class="font-secondary">
          Powered by <span class="font-medium">Typescript</span>,
          <span class="font-medium"> Next.js</span>, and <span class="font-medium">Python</span>.
        </h3>
      </div>
      <div
        class="w-full h-full scale-[150%] max-[64rem]:pt-[13%] max-[64rem]:-mb-[12.5%] -mb-[25%] ml-[7.5%]"
      >
        <landing-snoobot class="text-[#FF4400] -rotate-15 w-full h-full" [isGlowing]="true" />
      </div>
    </a>
  `,
})
export class LandingSnoospoofComponent {}
