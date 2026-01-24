import { Component, ElementRef, HostListener } from '@angular/core';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';

@Component({
  selector: 'landing-hero-motorcyclist',
  standalone: true,
  imports: [VideoAutoplayDirective],
  template: `
    <video
      src="assets/videos/motorcycleman/test_motorcycle_idle.webm"
      class="absolute bottom-[7.5vh] origin-bottom brightness-75 right-0 -mr-[57.5vw] md:mr-0 origin-bottom scale-y-[250%] -scale-x-[250%] translate-y-[2%] max-h-[calc((100vh-var(--spacing-2xl)+5%)/2.5)] overflow-x-hidden"
      disableRemotePlayback
      muted
      playsinline
      loop
      autoplay
      #motorcyclist
    >
      <source
        type="video/quicktime; codecs=hvc1.1.6.H120.b0"
        src="assets/videos/motorcycleman/test_motorcycle_idle.webm"
      />
    </video>
  `,
  host: {
    class: 'absolute bottom-0 size-full',
  },
  styles: [
    `
      :host(.scrolled)
        transform: translateX(calc(-100vw - 107.5%)) !important
        transition-duration: 10s
    `,
  ],
})
export class LandingHeroMotorcyclistComponent {
  constructor(private elementRef: ElementRef) {}

  @HostListener('window:scroll') // TODO: Revamp animation with GSAP
  onScroll() {
    const hostElement = this.elementRef.nativeElement;
    hostElement.classList.add('scrolled');
  }

}