import { Component, ElementRef, HostListener } from '@angular/core';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';

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
      #motorcyclist
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