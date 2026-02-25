import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingHeroMotorcyclistComponent } from '@features/landing/hero/landing-hero-motorcyclist';
import { LandingHeroAffordanceComponent } from '@features/landing/hero/landing-hero-affordance';
import { LandingHeroRainComponent } from '@features/landing/hero/landing-hero-rain';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    LandingHeroMotorcyclistComponent,
    LandingHeroAffordanceComponent,
    LandingHeroRainComponent
  ],
  template: `
    <section class="relative flex">
      <div class="flex flex-col gap-lg">
        <div>
          <h1 class="relative text-hero-accent z-[3]">Zooming</h1>
          <h1 class="relative z-[1]">Full Stack Developer</h1>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
          z-button
          class="w-min z-[5] group"
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
    <landing-hero-affordance
      class="absolute bottom-0 translate-y-[calc(var(--racetrack-height)/2.5)] -translate-x-1/2 left-1/2 z-[6] text-color-accent brightness-75 animate-bounce *:data-motorcycle:text-[9vw] *:data-arrow:text-[7.5vw] *:md:data-motorcycle:text-2xl *:md:data-arrow:text-xl
      [animation-duration:2500ms]transition-opacity duration-1500 ease-in-out"
      [idleTimeoutMS]="3250"
    />
    @defer (on idle) {
    <landing-hero-rain class="absolute top-0 -z-[4] w-full h-[calc(100%+var(--racetrack-height)+var(--spacing-3xs))] overflow-hidden"/>
    }
  `,
  host: {
    class: 'relative z-0',
  },
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
}

// h-[calc(100%+var(--racetrack-height))]