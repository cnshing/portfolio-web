import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input} from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { LandingHeroStarfieldSceneGraph } from "@features/landing/hero/starfield/landing-hero-starfield-graph";


/**
 * Three.JS animated starfield, with simple animation support and bindable star sizes.
 *
 * @export
 * @class LandingHeroStarfieldComponent
 * @typedef {LandingHeroStarfieldComponent}
 */
@Component({
	selector: 'landing-hero-starfield',
	template: `
  <ngt-canvas [camera]="{ position: [0, 0, 0.25], fov: 155, near: 0.00125, far:0.5}">
    <landing-hero-starfield-scene-graph [stars]="stars()" [starSize]="starSize()" [fieldRadius]="fieldRadius()" [starGlow]="starGlow()" [starFade]="starFade()" [fieldSpinX]="fieldSpinX()" [fieldSpinY]="fieldSpinY()" [fieldSpinZ]="fieldSpinZ()" [starColors]="starColors()" *canvasContent />
  </ngt-canvas>

	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtCanvas, LandingHeroStarfieldSceneGraph],
})
export class LandingHeroStarfieldComponent {
  /**
   * How many stars in the starfield.
   *
   * @readonly
   * @type {*}
   */
  readonly stars = input<number>(100)
  /**
   * How big each stars are.
   *
   * @readonly
   * @type {*}
   */
  readonly starSize = input<number>(0.001)
  /**
   * Size of the actual starfield.
   *
   * @readonly
   * @type {*}
   */
  readonly fieldRadius = input<number>(0.5)
  /**
   * Small decimal value to control glow softness and size, increases as starGlow gets bigger.
   *
   * @readonly
   * @type {*}
   */
  readonly starGlow = input<number>(0.2)
  /**
   * Small decimal value to control fade sharpness for star glow, where the falloff gets sharper as starFade gets lower.
   *
   * @readonly
   * @type {*}
   */
  readonly starFade = input<number>(0.1)
  /**
   * Spins the starfield in X direction, as constant velocity.
   *
   * @readonly
   * @type {*}
   */
  readonly fieldSpinX = input<number>(-1/1024)

  /**
   * Spins the starfield in Y direction, as constant velocity.
   *
   * @readonly
   * @type {*}
   */
  readonly fieldSpinY = input<number>(1/512)
  /**
   * Spins the starfield in Z direction, as constant velocity.
   *
   * @readonly
   * @type {*}
   */
  readonly fieldSpinZ = input<number>(1/256)

  /**
   * Any individual star will select from any of the following colors.
   *
   * @readonly
   * @type {*}
   */
  readonly starColors = input<string[]>(['white'])
}

