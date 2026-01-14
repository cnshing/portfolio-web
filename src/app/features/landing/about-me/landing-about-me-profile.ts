import { Component, WritableSignal, signal } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingAboutMeAvatarComponent, Postures, postures } from './me-avatar';
import { environment } from '@environments/environment';

@Component({
  selector: 'landing-about-me-profile',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent, LandingAboutMeAvatarComponent],
  template: `
    <div class="flex flex-col gap-xl">
      <div class="relative">
        <p
          class="text-center py-sm md:absolute text-xl md:text-left md:top-1/2 md:-translate-y-1/2 md:left-[calc(62.5%+var(--spacing-xl))] font-[Nanum_Pen_Script]"
        >
          <span class="hidden md:contents">↩&nbsp;&nbsp;</span>Give me a boop – see what happens!
        </p>
        <div class="flex justify-center">
          <button class="w-min rounded-full" (click)="this.onRandomAvatar($event)">
            <me-avatar [posture]="this.posture()"></me-avatar>
          </button>
        </div>
      </div>
      <div class="flex flex-wrap justify-center-safe gap-lg *:w-min">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="tel:{{ phone }}"
          z-button
          zType="outline"
        >
          <i z-icon zSize="lg" zType="phone"></i>
          {{ phone }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.openstreetmap.org/search?query={{ location }}"
          z-button
          zType="outline"
        >
          <i z-icon zSize="lg" zType="location"></i>
          {{ location }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:{{ email }}"
          z-button
          zType="outline"
        >
          <i z-icon zSize="lg" zType="email"></i>
          {{ email }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/{{ github }}"
          z-button
          zType="outline"
        >
          <i z-icon zSize="lg" zType="githubICO"></i>
          github.com/{{ github }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/{{ linkedin }}"
          z-button
          zType="outline"
        >
          <i z-icon zSize="lg" zType="linkedinICO"></i>
          {{ linkedin }}
        </a>
      </div>
    </div>
  `,
})
export default class LandingAboutMeProfileComponent {
  protected readonly location = environment.location;
  protected readonly email = environment.email;
  protected readonly github = environment.githubUsername;
  protected readonly linkedin = environment.linkedinUsername;
  protected readonly phone = environment.phoneNumber;
  protected readonly posture: WritableSignal<Postures> = signal('presenting');

  readonly onRandomAvatar = (event: Event) => {
    event.preventDefault();
    const avatars = postures.filter((p) => p !== this.posture());
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    this.posture.set(randomAvatar!);
  };
}
