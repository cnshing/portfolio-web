import { afterNextRender, Component, DestroyRef, inject, input, signal } from '@angular/core';

@Component({
  selector: 'landing-hero-rain',
  imports: [],
  template: `
    @for(drop of fuckyou; track $index; let last = $last) {
      <div
        class="absolute -rotate-17 rounded-full h-[2vh] w-[0.015vw] -translate-y-full animate-(--animate-rain) [animation-composition:add]"
        [attr.data-last]="last ? '': null"
        [class.opacity-0]="hidden()"
        [class.opacity-100]="!hidden()"
        [style.animation-duration]="randomDuration()"
        [style.transform]="randomPosition()"
        [style.background]="randomShade()"
      ></div>

    }
  `,
  host: {
    'class': 'group [container-type:inline-size]',
  },
  styleUrl: './landing-hero-rain.sass',
})
export class LandingHeroRainComponent {
  readonly raindrops = input<number>(Math.max(Math.floor(window.innerWidth/(0.015+4)), 25));

  readonly fuckyou = Array(this.raindrops());
  protected readonly hidden = signal<boolean>(true)
  protected readonly randomShade = () => {
    const colors = ["gray-700", "gray-600"]
    return `var(--color-${colors[Math.floor(Math.random() * colors.length)]!})`;
  }
  protected readonly randomDuration = (factor: number = 1): string => `${this.getRandomInt(2000, 2400)*factor}ms`;

  protected getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  protected readonly randomPosition = (): string => `translateX(${this.getRandomInt(-Math.cos(15*Math.PI/360)*50, 100)}vw)`;

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.hidden.set(false), 5000)
    });

    inject(DestroyRef).onDestroy(() => {});
  }
}
