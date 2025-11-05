import { Component, input } from '@angular/core';

/**
 * Generic Playground section detailing general type of primtive component.
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
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
