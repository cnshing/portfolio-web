import { Component, input } from '@angular/core';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardTooltipModule } from '@shared/components/tooltip/tooltip';


/**
 * Component inputs for LandingSkillCardComponent.
 *
 * @export
 * @interface LandingSkillCardInput
 * @typedef {LandingSkillCardInput}
 */
export interface LandingSkillCardInput {
  /**
   * A asset retrievable string path of the skill's corresponding logo.
   *
   * @type {string}
   */
  skillImg: string
  /**
   * The skill name.
   *
   * @type {string}
   */
  name: string,

  /**
   * Optional short description of how this skill is used.
   *
   * @type {?string}
   */
  description?: string,
}

/**
 * A simple card illustrating a particular skill with optional tooltip.
 *
 * @export
 * @class LandingSkillCardComponent
 * @typedef {LandingSkillCardComponent}
 */
@Component({
  selector: 'landing-skill-card',
  standalone: true,
  imports: [
    ZardCardComponent,
    ZardTooltipModule
  ],
  template: `
    <ng-template #skillIcon>
      <img class="m-auto" [src]="skillImg()"/>
    </ng-template>
    <div>
      <z-card
      class="aspect-square *:h-full"
      [zAvatarOrIcon]="skillIcon"
      [zTooltip]="description() || null"/>
      <p class="text-center h-12 flex items-center justify-center"> {{ name() }}</p>
  </div>
  `,
})
export class LandingSkillCardComponent {
  /**
   * A asset retrievable string path of the skill's corresponding logo.
   *
   * @readonly
   * @type {LandingSkillCardInput["skillImg"]}
   */
  readonly skillImg = input.required<LandingSkillCardInput["skillImg"]>()

  /**
   * The skill name.
   *
   * @readonly
   * @type {LandingSkillCardInput["name"]}
   */
  readonly name = input.required<LandingSkillCardInput["name"]>()

  /**
   * Optional short description of how this skill is used.
   *
   * @readonly
   * @type {LandingSkillCardInput["description"]}
   */
  readonly description = input<LandingSkillCardInput["description"]>("");


}
