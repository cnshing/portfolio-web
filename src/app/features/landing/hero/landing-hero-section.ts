import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingHeroMotorcyclistComponent } from '@features/landing/hero/landing-hero-motorcyclist';
@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent, LandingHeroMotorcyclistComponent],
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
          class="w-min z-[3]"
        >
          <i z-icon zSize="lg" zType="resume"></i>
          View Resume
        </a>
      </div>
    </section>
    <landing-hero-motorcyclist class="z-[2]" />
  `,
  host: {
    class: 'relative z-0',
  },
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
}
