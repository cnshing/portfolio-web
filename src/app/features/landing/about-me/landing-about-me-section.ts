import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { LandingWaveIconComponent } from '@features/landing/icons/landing-wave-icon';
import LandingAboutMeProfileComponent from '@features/landing/about-me/landing-about-me-profile';

@Component({
  selector: 'landing-about-me',
  standalone: true,
  imports: [LandingAboutMeProfileComponent, LandingWaveIconComponent],
  template: `
    <section class="grid auto-grid-line-length">
      <div class="m-auto">
        <h2>
          Hi — <span class="text-color-accent">{{ name }}</span> here!
          <landing-wave-icon
            #wave
            (click)="wave.animation()?.isPaused() ? wave.animation()?.play() : wave.animation()?.pause()"
            (mouseenter)="wave.animation()?.play()"
            (mouseleave)="wave.animation()?.pause()"
          />
        </h2>
        <br />
        <br />
        <p>
          I’m a full stack engineer who’s out to get hands-on and grasp every aspect of product
          development. It's why I spent a disproportionate amount of time towards web design,
          precisely because I was initially horrendous at it.
        </p>
        <br />
        <br />
        <p>
          My previous role at a <span class="text-color-accent">robotics startup</span> centered
          around development for security monitoring software, including middleware sensor
          integration and <span class="text-color-accent">A.I.</span>-driven proof-of-concept threat
          analysis.
        </p>
        <br />
        <br />
        <p>
          The position also presented an opportunity to serve as a
          <span class="text-color-accent">team lead</span>, where I led software architecture
          decisions, jumpstarted many key <span class="text-color-accent">Agile processes</span>,
          and actively mentored the team.
        </p>
        <br />
        <br />
        <p>You can read more about my experience in the next section.</p>
      </div>

      <landing-about-me-profile class="mx-auto" />
    </section>
  `,
})
export default class LandingAboutMeComponent {
  protected readonly name = environment.name;
}
