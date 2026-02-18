import { Component, WritableSignal, signal } from '@angular/core';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingAboutMeAvatarComponent, Postures, postures } from './me-avatar';
import { environment } from '@environments/environment';
import { avatarSrcPath } from '@features/landing/about-me/me-avatar';
import { LandingAboutMeEmailComponent } from '@features/landing/about-me/landing-about-me-email';
import { LandingAboutMeGithubComponent } from '@features/landing/about-me/landing-about-me-github';

@Component({
  selector: 'landing-about-me-profile',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    LandingAboutMeAvatarComponent,
    LandingAboutMeEmailComponent,
    LandingAboutMeGithubComponent,
  ],
  template: `
    <div class="flex flex-col gap-xl">
      <div class="relative">
        <p
          class="text-center py-sm md:absolute text-xl md:text-left md:top-1/2 md:-translate-y-1/2 font-[Nanum_Pen_Script] md:left-(--avatar-label-offset)"
          id="callToBoop"
        >
          <i
            class="hidden md:contents md:static md:inline-flex md:align-baseline md:*:-rotate-5"
            z-icon
            zSize="lg"
            zType="arrowArcLeft"
          ></i
          >&nbsp;Give me a boop to see what happens!
        </p>
        <div class="flex relative justify-center">
          <i
            class="absolute top-1/4 left-35/100 translate-x-(--mobile-arrow-x-offset) -translate-y-(--mobile-arrow-y-offset) *:-rotate-100 text-xl *:-scale-y-100 text-color-secondary md:hidden"
            z-icon
            zSize="lg"
            zType="arrowArcLeft"
          ></i>
          <!-- Hacky workaround that uses duplicate icon elements for mobile/desktop call to action -->
          <button
            aria-labelledby="callToBoop"
            class="w-(--avatar-width) rounded-full"
            (click)="this.onRandomAvatar($event)"
            (mouseenter)="this.onHoverload()"
          >
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
          <i class="animate-phone" z-icon zSize="lg" zType="phone"></i>
          {{ phone }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.openstreetmap.org/search?query={{ location }}"
          z-button
          zType="outline"
        >
          <i class="animate-location" z-icon zSize="lg" zType="location"></i>
          {{ location }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:{{ email }}"
          z-button
          zType="outline"
          (mouseenter)="emailIcon.open()"
          (mouseleave)="emailIcon.close()"
          (focus)="emailIcon.open()"
          (focusout)="emailIcon.close()"
        >
          <landing-about-me-email-icon #emailIcon />
          {{ email }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/{{ github }}"
          z-button
          zType="outline"
          (mouseenter)="githubIcon.animation()?.play()"
          (mouseleave)="githubIcon.animation()?.pause()"
          (focus)="githubIcon.animation()?.play()"
          (focusout)="githubIcon.animation()?.pause()"
        >
          <landing-about-me-github-icon #githubIcon />
          {{ github }}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/{{ linkedin }}"
          z-button
          zType="outline"
        >
          <i class="animate-linkedin" z-icon zSize="lg" zType="linkedinICO"></i>
          {{ linkedin }}
        </a>
      </div>
    </div>
  `,
  styles: `
  :host
    --avatar-width: min(max(50cqw,
  var(--spacing-2xl) + 6rem),
  var(--spacing-3xl) * 2)

    --avatar-label-offset: calc(50% + var(--avatar-width) / 2 + var(--spacing-md)) /* Location of avatar plus spacing offset */

    --mobile-arrow-x-offset: calc(var(--avatar-width)*0.5*cos(45deg))
    --mobile-arrow-y-offset: calc(var(--avatar-width)*0.5*sin(45deg))
  `,
  styleUrls: ['landing-about-me-profile-animations.sass'],
})
export default class LandingAboutMeProfileComponent {
  protected readonly location = environment.location;
  protected readonly email = environment.email;
  protected readonly github = environment.githubUsername;
  protected readonly linkedin = environment.linkedinUsername;
  protected readonly phone = environment.phoneNumber;

  /**
   * The current avatar posture.
   *
   * @protected
   * @readonly
   * @type {WritableSignal<Postures>}
   */
  protected readonly posture: WritableSignal<Postures> = signal('presenting');

  /**
   * Any avatars that have been fetched once before.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly loadedAvatars = new Set<Postures>(['presenting']);

  /**
   * Randomly selects a posture except for `exclude`
   *
   * @private
   * @param {Postures} exclude This posture will not be selected
   * @returns {Postures} A randomly selected posture
   */
  protected readonly selectRandomPosture = (exclude: Postures): Postures => {
    const availablePostures = postures.filter((p) => p !== exclude);
    return availablePostures[Math.floor(Math.random() * availablePostures.length)]!;
  };

  /**
   * The next avatar posture to play when requested.
   *
   * @private
   * @readonly
   * @type {WritableSignal<Postures>}
   */
  protected readonly nextPosture: WritableSignal<Postures> = signal(
    this.selectRandomPosture('presenting')
  );

  /**
   * Attempts to fetch the video resource for `posture`
   *
   * @private
   * @param {Postures} posture
   */
  protected readonly loadAvatar = (posture: Postures): void => {
    if (!this.loadedAvatars.has(posture)) {
      fetch(`${avatarSrcPath(posture)}.mp4`, {
        method: 'GET',
        cache: 'force-cache',
        priority: 'low',
      } as RequestInit);

      fetch(`${avatarSrcPath(posture)}.webm`, {
        method: 'GET',
        cache: 'force-cache',
        priority: 'low',
      } as RequestInit);

      this.loadedAvatars.add(posture);
    }
  };

  protected readonly onHoverload = () => {
    this.loadAvatar(this.nextPosture());
  };

  protected readonly onRandomAvatar = (event: Event) => {
    event.preventDefault();
    this.posture.set(this.nextPosture());
    this.nextPosture.set(this.selectRandomPosture(this.nextPosture()));
  };
}
