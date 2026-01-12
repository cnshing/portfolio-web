import { Component } from '@angular/core';
import { LandingProjectsCardComponent } from '@features/landing/projects/landing-projects-card';

/**
 * Linux Bento Card.
 *
 * @export
 * @class LandingLinuxComponent
 * @typedef {LandingLinuxComponent}
 */
@Component({
  selector: 'landing-linux-card',
  standalone: true,
  providers: [],
  imports: [LandingProjectsCardComponent],
  template: `
    <landing-projects-card
      class="bg-[#F8BF11] p-md flex flex-col justify-center border border-color-[#202020]"
    >
      <h2 class="inline-flex flex-wrap text-[#202020] justify-center gap-y-xs items-center text-right max-[31.875rem]:text-center">
        Custom<br class="md:hidden"/>OS<img class="size-2xl" src="assets/icons/linux.svg" />
      </h2>
    </landing-projects-card>
  `,
})
export class LandingLinuxComponent {}
