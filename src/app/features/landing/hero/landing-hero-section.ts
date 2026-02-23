import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingHeroMotorcyclistComponent } from '@features/landing/hero/landing-hero-motorcyclist';
import { LandingHeroAccordanceComponent } from '@features/landing/hero/landing-hero-accordance';
@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    LandingHeroMotorcyclistComponent,
    LandingHeroAccordanceComponent,
  ],
  template: `
    <section class="relative flex">
      <div class="flex flex-col gap-lg">
        <div>
          <h1 class="relative text-hero-accent z-[4]">Zooming</h1>
          <h1 class="relative z-[1]">Full Stack Developer</h1>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
          z-button
          class="w-min z-[3] group"
        >
          <i
            class="-rotate-9 group-hover:-rotate-19 group-focus:-rotate-19 transition-transform duration-250"
            z-icon
            zSize="lg"
            zType="resume"
          ></i>
          View Resume
        </a>
      </div>
    </section>
    <landing-hero-motorcyclist class="z-[2]" />
    <landing-hero-accordance
      class="absolute bottom-0 translate-y-[calc(var(--racetrack-height)/2.5)] -translate-x-1/2 left-1/2 z-[4] text-color-accent brightness-75 animate-bounce *:data-motorcycle:text-[9vw] *:data-arrow:text-[7.5vw] *:md:data-motorcycle:text-2xl *:md:data-arrow:text-xl"
    />
  `,
  host: {
    class: 'relative z-0',
  },
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
}
