import { Component, input } from '@angular/core';

/**
 * Landing Navigation Column.
 *
 * @export
 * @class LandingNavGroupComponent
 * @typedef {LandingNavGroupComponent}
 */
@Component({
  selector: 'landing-nav-group',
  standalone: true,
  providers: [],
  imports: [],
  template: `
    <section class="flex flex-col gap-xs">
      <h4>{{ title() }}</h4>
      <ul class="flex flex-col gap-2xs text-secondary text-lg font-secondary">
        <ng-content />
      </ul>
    </section>
  `,
})
export class LandingNavGroupComponent {
  /**
   * Title of the navigation column.
   *
   * @readonly
   * @type {*}
   */
  readonly title = input.required<string>();
}
