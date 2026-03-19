import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { LandingHeroMotorcyclistComponent } from '@features/landing/hero/motorcyclist/landing-hero-motorcyclist';
import { LandingHeroAffordanceComponent } from '@features/landing/hero/landing-hero-affordance';
import { NgOptimizedImage } from '@angular/common';
import { LandingVinylIconComponent } from '@features/landing/icons/landing-vinyl-icon';
import { LandingHeroStarfieldComponent } from '@features/landing/hero/starfield/landing-hero-starfield';
import { isTouchDevice } from '@shared/utils/accessibility';

@Component({
  selector: 'landing-hero',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    LandingHeroAffordanceComponent,
    NgOptimizedImage,
    LandingVinylIconComponent,
    LandingHeroStarfieldComponent,
    LandingHeroMotorcyclistComponent
],
  template: `
    <section class="relative">
      <div class="flex flex-col gap-lg w-fit">
        <div>
          <h1 class="relative text-hero-accent z-[4]">Zooming</h1>
          <h1 class="relative z-[2] backdrop-blur-[0.5px]">Full Stack Developer</h1>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          [href]="'resumes/' + name.replace(' ', '_') + '_Resume.pdf'"
          z-button
          class="w-min z-[6] group !shadow-hero-button pointer-events-auto"
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
    <landing-hero-motorcyclist [enterDurationSecs]="isReduceMotion ? 4.0 : 2.0" class="absolute pt-2xl z-[3] bottom-0 size-full" />
    <landing-hero-affordance
      class="absolute bottom-0 translate-y-[calc(var(--racetrack-height)/2)] -translate-x-1/2 left-1/2 z-[7] text-color-accent brightness-75 animate-bounce *:data-motorcycle:text-[9vw] *:data-arrow:text-[7.5vw] *:md:data-motorcycle:text-2xl *:md:data-arrow:text-xl
      [animation-duration:2500ms]transition-opacity duration-1500 ease-in-out"
      [idleTimeoutMS]="3250"
    />
    <div class="absolute size-full h-[calc(100%+var(--racetrack-height))] z-[1] flex flex-col">
      @defer (on immediate) {
        <landing-hero-starfield class="grow min-h-0 -mb-sm pointer-events-auto" [starColors]="starColors" [stars]="numStars" [starSize]="starSize" [fieldEnterDuration]="2.85" [starEnterDuration]="2.5" [starGlow]="80" [fieldSpinX]="isReduceMotion ? 1/1024 : 1/128" [fieldSpinY]="isReduceMotion ? 1/512: 1/128" />
      } @placeholder (minimum 1s) {
        <div data-landing-hero-starfield-placeholder class="grow min-h-0 -mb-sm"></div>
      }
      <!-- <img src="https://svs.gsfc.nasa.gov/vis/a000000/a004400/a004451/RandomizedSkymap.t4_04096x02048_print.jpg" class="brightness-75 grow min-h-0 -mb-sm" /> --> <!-- Backup space placeholder-->
    <img
      #landingHeroRoad
      class="brightness-40 w-full h-[calc(33%+var(--racetrack-height))] z-[1.5] object-cover shrink-0"
      ngSrc="/assets/graphics/road.png"
      [loaderParams]="{baseWidth: 3382, stepDownOffset: 0}"
      width="3382"
      height="858"
      sizes="auto"
      decoding="async"
      alt="Road Asphalt"
      priority
    />
    </div>
    @if (enableMusic) {
      <button #landingHeroMusic class="absolute top-md right-md right-sm z-[6] aspect-square !size-lg !p-3xs !rounded-sm animate-(--animate-fade-in) pointer-events-auto" aria-label="musicPlayer" z-button zType="outline" (click)="music.paused ? music.play() : music.pause()">
      <audio loop disableRemotePlayback #music preload="none">
        <source src="/assets/music/background.mp3" type="audio/mp3" />
      </audio>
      <landing-vinyl-icon [paused]="music.paused" />
    </button>
    }
  `,
  styles: `
  :host
    --animate-fade-in: fadein 8s linear
  @layer components
    @keyframes fadein
      0%
        opacity: 0
        pointer-events: none
      75%
        opacity: 0
      100%
        opacity: 1
        pointer-events: auto
  `,
  host: {
    class: 'relative flex flex-col pointer-events-none',
  },
})
export default class LandingHeroComponent {
  protected readonly name = environment.name;
  protected readonly starColors = ['#e5e6e3', '#cdcecb'] // NOTE: This is meant to be --text-color-secondary and --text-color-tertiary, respectively
  protected readonly numStars = window.innerWidth > window.innerHeight ? window.innerWidth/2: (window.innerHeight*0.77)/4 // 0.77 choosen here because road element is roughly 33% height of the window.

  protected readonly starSize = isTouchDevice() ? window.innerHeight/3_000_00: 0.001


  protected readonly isReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  protected readonly enableMusic = environment.enableMusic

}
