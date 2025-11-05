import { Component, input } from '@angular/core';

/**
 * Generic Playground section detailing general type of primtive component. Primitive components should not be used to create any playground components as failures in any primitive component can prevent a playground component from rendering. Playground components should be as simple as possible to reduce complexity and prone to error.
 *
 * @export
 * @class PlaygroundSectionComponent
 * @typedef {PlaygroundSectionComponent}
 */
@Component({
  selector: 'playground-section',
  standalone: true,
  template: `
    <section class="flex flex-col gap-lg">
      <div class="flex flex-col gap-md">
        <h2>{{ title() }}</h2>
        <p>{{ description() }}</p>
      </div>
      <ng-content></ng-content>
    </section>
  `,
})
export class PlaygroundSectionComponent {
  /**
   * Short title of the general set of primitive component being rendered - buttons, icons, etc.
   *
   * @readonly
   * @type {*}
   */
  readonly title = input.required<string>();
  /**
   * Additional information for what is being rendered
   *
   * @readonly
   * @type {*}
   */
  readonly description = input.required<string>();
}
