import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent],
  template: `
    <section class="flex">
      <div class="flex flex-col gap-lg max-w-line-length z-1">
        <div>
          <h1 class="text-hero-accent">Zooming</h1>
          <h1 class="inline-block">Full Stack Developer</h1>
        </div>
        <p>
          <span class="text-color-accent">{{ name }}</span> here — a software engineer experienced
          in frontend and middleware development for ROS (Robot Operating System).
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
          z-button
          class="w-min"
        >
          <i z-icon zSize="lg" zType="resume"></i>
          View Resume
        </a>
      </div>
      <video disableRemotePlayback  autoplay loop class="max-w-full">
        <source src="assets/videos/motorcycle.mp4" type="video/mp4" />
      </video>
    </section>
  `,
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
}
