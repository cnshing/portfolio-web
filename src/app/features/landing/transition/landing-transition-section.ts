import { Component, input } from "@angular/core";

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
  /**
   * The resulting implicit shape created from the racetrack component is filled by this value. Useful for when elements are overflowing into this component and you want a clean visual seperation between the top and bottom of this component.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  readonly fillTransitionMask = input<string>("transparent")
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
