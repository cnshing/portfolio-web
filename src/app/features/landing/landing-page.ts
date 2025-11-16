import { Component } from "@angular/core";
import { LandingHeroComponent } from "@features/landing/landing-hero-section";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [LandingHeroComponent],
  template: `
  <landing-hero />
  `
})
export class LandingPageComponent {

}