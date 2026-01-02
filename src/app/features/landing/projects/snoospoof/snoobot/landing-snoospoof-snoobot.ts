import { Component, input } from '@angular/core';
import { ClassValue } from 'clsx';

/**
 * Snoobot SVG.
 *
 * @export
 * @class LandingSnoobotComponent
 * @typedef {LandingSnoobotComponent}
 */
@Component({
  selector: 'landing-snoobot',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: 'landing-snoospoof-snoobot.svg',
  styleUrl: 'landing-snoospoof-snoobot.sass'
})
export class LandingSnoobotComponent {
  /**
   * Is the eye's glowing?
   *
   * @readonly
   * @type {boolean}
   */
  readonly isGlowing = input.required<boolean>()

  readonly class = input<ClassValue>('');
}
