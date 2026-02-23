import { Component } from '@angular/core';
import { ZardIconComponent } from "@shared/components/icon/icon.component";

@Component({
  selector: 'landing-hero-accordance',
  imports: [ZardIconComponent],
  template: `
  <z-icon data-motorcycle class="" zType="motorcycle" />
  <z-icon data-arrow class="-translate-y-1/4" zType="caretDown" />
  `,
})
export class LandingHeroAccordanceComponent {

}
