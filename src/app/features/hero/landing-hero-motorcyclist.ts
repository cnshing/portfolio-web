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
        const startDuration = 7;
        const bounce = (frequency: number, repeat: number) => {
          return {
            yPercent: '+=0.65',
            duration: 1 / frequency,
            ease: 'rough({strength: 10, template: elastic.out(1,0.3), randomize:true, taper: out})',
            repeat: Math.floor((repeat * frequency) / 2) * 2,
            yoyo: true,
          };
        };
        const animation = gsap.timeline();

        animation.from(
          motorcyclist,
          {
            xPercent: 150,
            duration: startDuration,
            ease: 'power3.out',
          },
          0
        );

        animation.add('vehcileEnterDone', '>');

        animation
          .to(motorcyclist, bounce(14, (0.75 / 4) * startDuration), 0)
          .to(motorcyclist, bounce(6, (1.54 / 4) * startDuration), 0);

        const config = (): ScrollTrigger.StaticVars => ({
          trigger: motorcyclist,
          start: (_) => { // If already passed the top, the new start equivalent to the viewport top. This prevents an sudden jump if the user scroll position is already in the middle of the tween progress.
            const triggerTop = motorcyclist.getBoundingClientRect().top;
            const triggerBot = motorcyclist.getBoundingClientRect().bottom
            console.log(triggerBot)
            if (triggerTop < 0 && triggerBot > 0) {
              return window.pageYOffset;
            }
            return 'top top';
          },
          end: 'bottom top',
          scrub: 2.5,
          markers: true,
          animation: gsap.to(motorcyclist, {
            xPercent: -102.5,
            x: '-100vw',
            ease: 'circ.out',
          }),
          onEnterBack: () => {
            ScrollTrigger.refresh(); // Re-evaluate `start()` on back
          },
        });

        animation.call(() => {
            ScrollTrigger.create(config()); // Only enable ScrollTrigger after animation is done
          },
          undefined,
          'vehcileEnterDone-=0.75'
        );

        // console.log(vehcileLeaveTrigger)

        // vechileLeave.to(
        //   motorcyclist,
        //   {
        //     yPercent: '+=0.5',
        //     duration: 1 / 14,
        //     ease: 'rough({strength: 10, template: elastic.out(1,0.3), randomize:true, taper: out})',
        //     repeat: -1,
        //     yoyo: true,
        //   },
        //   0
        // );
      });

      this.animate.set(context);
    });

    inject(DestroyRef).onDestroy(() => this.animate()?.revert()); // Do not evalute this.animate() directly
  }
  protected readonly animate = signal<gsap.Context | null>(null);

  protected readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('heroMotorcyclist');
}
