import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingHeroMotorcyclistComponent } from '@features/landing/hero/landing-hero-motorcyclist';
import { LandingHeroAffordanceComponent } from '@features/landing/hero/landing-hero-affordance';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    LandingHeroMotorcyclistComponent,
    LandingHeroAffordanceComponent,
  ],
  template: `
    <section class="relative flex-1">
      <div class="flex flex-col gap-lg">
        <div>
          <h1 class="relative text-hero-accent z-[4]">Zooming</h1>
          <h1 class="relative z-[2]">Full Stack Developer</h1>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
          z-button
          class="w-min z-[6] group !shadow-hero-button"
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
    <landing-hero-motorcyclist class="z-[3]" />
    <landing-hero-affordance
      class="absolute bottom-0 translate-y-[calc(var(--racetrack-height)/2.5)] -translate-x-1/2 left-1/2 z-[7] text-color-accent brightness-75 animate-bounce *:data-motorcycle:text-[9vw] *:data-arrow:text-[7.5vw] *:md:data-motorcycle:text-2xl *:md:data-arrow:text-xl
      [animation-duration:2500ms]transition-opacity duration-1500 ease-in-out"
      [idleTimeoutMS]="3250"
    />
    <img
      #landingHeroRoad
      class="absolute brightness-40 w-full h-[calc(33%+var(--racetrack-height))] z-[1] object-cover -bottom-(--racetrack-height) "
      src="/assets/graphics/road.png"
    />
  `,
  host: {
    class: 'relative flex flex-col z-0',
  },
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
}
