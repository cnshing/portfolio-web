import { Component, input } from '@angular/core';

/**
 * Container for any primiitive component.  Primitive components should not be used to create any playground components as failures in any primitive component can prevent a playground component from rendering. Playground components should be as simple as possible to reduce complexity and prone to error.
 *
 * @export
 * @class PlaygroundCardComponent
 * @typedef {PlaygroundCardComponent}
 */
@Component({
  selector: 'playground-card',
  standalone: true,
  template: `
    <div class="bg-color-surface1 border border-color-subtle rounded-md p-lg min-w-fit flex flex-col gap-md">
      @if (title()) {
        <h4>{{ title() }}</h4>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class PlaygroundCardComponent {
  /**
   * Title containing specific feature of a primitive component.
   *
   * @readonly
   * @type {*}
   */
  readonly title = input<string>()
}
