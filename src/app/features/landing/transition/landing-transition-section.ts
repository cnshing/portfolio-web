import { Component } from "@angular/core";

/**
 * A small section with glowing neon 2D "race tracks".
 *
 * @export
 * @class LandingTransitionComponent
 * @typedef {LandingTransitionRacetrackComponent}
 */
@Component({
  selector: 'landing-transition-racetrack',
  standalone: true,
  imports: [],
  templateUrl: './landing-transition-section-racetrack.svg',
  styleUrl: './landing-transition-section.sass',
})
export class LandingTransitionRacetrackComponent {
}


/**
 * A small section with glowing neon 2D bottom "helmet".
 *
 * @export
 * @class LandingTransitionComponent
 * @typedef {LandingTransitionHelmetComponent}
 */
@Component({
  selector: 'landing-transition-helmet',
  standalone: true,
  imports: [],
  templateUrl: './landing-transition-section-helmet.svg',
  styleUrl: './landing-transition-section.sass',
})
export class LandingTransitionHelmetComponent {
}
