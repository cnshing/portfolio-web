import { Component, computed, input } from '@angular/core';
import { mergeClasses } from '@shared/utils/merge-classes';
import { ClassValue } from 'clsx';

/**
 * Shared parent portfolio project singleton card.
 *
 * @export
 * @class LandingProjectsCardComponent
 * @typedef {LandingProjectsCardComponent}
 */
@Component({
  selector: 'a[landing-projects-card]',
  standalone: true,
  providers: [],
  template: ` <ng-content /> `,
  host: {
    '[class]': 'classes()',
  },
})
export class LandingProjectsCardComponent {
  readonly class = input<ClassValue>('');

  /**
   * Default styling options shared across all portfolio cards.
   *
   * @protected
   * @readonly
   * @type {string}
   */
  protected readonly baseClass =
    'hover:scale-105 focus:scale-105 ease-in-out duration-250 inline-block rounded-lg h-full w-full';

  /**
   * Final computed merged class.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly classes = computed(() => mergeClasses(this.baseClass, this.class()));
}
