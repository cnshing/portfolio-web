import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";


/**
 * A small section with glowing neon 2D "race tracks".
 *
 * @export
 * @class LandingTransitionComponent
 * @typedef {LandingTransitionComponent}
 */
@Component({
  selector: 'landing-transition',
  standalone: true,
  imports: [NgClass],
  templateUrl: './landing-transition-section.html',
  styleUrl: './landing-transition-section.sass'
})
export default class LandingTransitionComponent {
  /**
   * From which direction should the line start?
   *
   * @readonly
   * @type {*}
   */
  readonly direction = input.required<"left"|"right">()
}