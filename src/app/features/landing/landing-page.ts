import { Component } from "@angular/core";
import { LandingHeroComponent } from "@features/landing/landing-hero-section";
import LandingTransitionComponent from "@features/landing/transition/landing-transition-section";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [LandingHeroComponent, LandingTransitionComponent],
  template: `
  <landing-hero />
  <landing-transition direction="left">
  `
})
export class LandingPageComponent {

}