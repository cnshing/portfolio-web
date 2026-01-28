import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GSDevTools } from 'gsap/GSDevTools';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(GSDevTools);

@Component({
  selector: 'landing-hero-motorcyclist',
  standalone: true,
  imports: [VideoAutoplayDirective],
  template: `
    <video
      src="assets/videos/motorcycleman/test_motorcycle_idle_flipped.webm"
      class="brightness-75 w-full ml-[50vw] origin-bottom scale-[250%] max-h-[min((100%-var(--spacing-2xl)+4.25%)/2.5,var(--spacing-2xl)*4)] overflow-x-hidden"
      disableRemotePlayback
      muted
      playsinline
      loop
      autoplay
      #heroMotorcyclist
    >
      <source
        type="video/quicktime; codecs=hvc1.1.6.H120.b0"
        src="assets/videos/motorcycleman/test_motorcycle_idle_flipped.webm"
      />
    </video>
  `,
  host: {
    class: 'absolute bottom-0 size-full flex flex-col justify-end pl-lg',
  },
})
export class LandingHeroMotorcyclistComponent {
  constructor() {
    afterNextRender(() => {
      const context = gsap.context(() => {
        const motorcyclist = this.video().nativeElement;
        const startDuration = 2.5;
        const bounce = (frequency: number, repeat: number) => {
          return {
            yPercent: '+=0.5',
            duration: 1 / frequency,
            ease: 'rough({strength: 10, template: bounce.out})',
            repeat: repeat * frequency,
            yoyo: true,
          };
        };
        const animation = gsap.timeline();

        animation.from(
          motorcyclist,
          {
            xPercent: 125,
            duration: startDuration,
            ease: 'rough({strength: 25, template:power1.out, randomize: true})',
          },
          0
        );

        animation.add('vehcileEnterDone', '>');
        animation.to(motorcyclist, bounce(12, (3.5 / 4) * startDuration), 0);

        const config = (
          animation: () => ScrollTrigger.StaticVars['animation']
        ): ScrollTrigger.StaticVars => ({
          trigger: motorcyclist,
          start: (_) => {
            return window.pageYOffset;
          },
          end: (_) => {
            return window.innerHeight;
          },
          scrub: 5,
          markers: true,
          animation: animation(),
          onEnterBack: () => {
            ScrollTrigger.refresh(); // Re-evaluate `start()` on back
          },
        });

        animation.call(
          () => {
            ScrollTrigger.create(
              config(() =>
                gsap.to(motorcyclist, {
                  xPercent: -102.5,
                  x: '-100vw',
                })
              )
            );
            ScrollTrigger.create(config(() => gsap.to(motorcyclist, bounce(12, 12))));
          },
          undefined,
          'vehcileEnterDone'
        );
      });
      this.animate.set(context);
    });

    inject(DestroyRef).onDestroy(() => this.animate()?.revert()); // Do not evalute this.animate() directly
  }
  protected readonly animate = signal<gsap.Context | null>(null);

  protected readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('heroMotorcyclist');
}
