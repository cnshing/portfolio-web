import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, viewChild } from '@angular/core';
import { beforeRender, extend } from 'angular-three';
import { NgtsCustomShaderMaterial } from 'angular-three-soba/materials';
import { NgtsPointsBuffer } from 'angular-three-soba/performances';
import { random } from 'maath';
import { Group, PointsMaterial, Color, IUniform } from 'three';
import { NgtsOrbitControls } from "angular-three-soba/controls";
import { fragmentShader, vertexShader } from '@features/landing/hero/starfield/landing-hero-starfield-shaders';

extend(
  Group
)

interface StarfieldUniforms {
  time: IUniform<number>;
}

/**
 * Scene Graph for a Starfield. Based off https://angularthree.org/reference/soba/materials/point-material/#tab-panel-243
 *
 * @export
 * @class LandingHeroStarfieldSceneGraph
 * @typedef {LandingHeroStarfieldSceneGraph}
 */
@Component({
    selector: 'landing-hero-starfield-scene-graph',
    template: `
		<ngt-group>
			<ngts-points-buffer [positions]="sphere()" [colors]="colors()" [stride]="3">
        <ngts-custom-shader-material
                [baseMaterial]="PointsMaterial"
                [options]="{
                  vertexShader: vertexShader(),
                  fragmentShader: fragmentShader(),
                  uniforms: uniforms(),
                  transparent: true,
                  vertexColors: true,
                  size: starSize(),
                  sizeAttenuation:true,
                  depthWrite: false,
                  depthTest: false,
                  frustumCulled: true
                }"
            />
			</ngts-points-buffer>
      <ngts-orbit-controls [options]="{enableZoom: false}"/>
		</ngt-group>
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgtsPointsBuffer, NgtsCustomShaderMaterial, NgtsOrbitControls],
})
export class LandingHeroStarfieldSceneGraph {


    protected readonly PointsMaterial = PointsMaterial

    /**
     * Total size of starfield sphere.
     *
     * @readonly
     * @type {*}
     */
    readonly fieldRadius = input.required<number>()
    /**
     * Number of stars to plot among the starfield asphere.
     *
     * @readonly
     * @type {*}
     */
    readonly stars = input.required<number>()

    /**
     * Individual star size.
     *
     * @readonly
     * @type {*}
     */
    readonly starSize = input.required<number>()

    /**
     *  This factor ensures there is actually roughly `this.stars()` stars visually on screen
     *
     * @readonly
     * @type {11}
     */
    readonly STAR_TO_COUNT_FACTOR = 11

    /**
     * True number of points on the starfield sphere.
     *
     * @protected
     * @readonly
     * @type {*}
     */
    protected readonly count = computed(() =>this.stars()*this.STAR_TO_COUNT_FACTOR)

    /**
     * Glow strength of an star.
     *
     * @readonly
     * @type {*}
     */
    readonly starGlow = input.required<number>()
    /**
     * Fade bias of an star.
     *
     * @readonly
     * @type {*}
     */
    readonly starFade = input.required<number>()

    /**
     * Shader to handle sweep animation.
     *
     * @protected
     * @readonly
     * @type {*}
     */
    protected readonly vertexShader = computed(() => vertexShader())

    /**
     * Shader to handle star fade and glow.
     *
     * @protected
     * @readonly
     * @type {*}
     */
    protected readonly fragmentShader = computed(() => fragmentShader(this.starFade(), this.starGlow()))

    /**
     * Randomized star positions of starfield.
     *
     * @protected
     * @readonly
     * @type {*}
     */
    protected readonly sphere = computed<Float32Array>(() =>random.inSphere(new Float32Array(this.count()*3), { radius: this.fieldRadius() }) as Float32Array);

    /**
     * Starfield's spinning X velocity.
     *
     * @readonly
     * @type {*}
     */
    readonly fieldSpinX = input.required<number>()
    /**
     * Starfield's spinning Y velocity.
     *
     * @readonly
     * @type {*}
     */
    readonly fieldSpinY = input.required<number>()
    /**
     * Starfield's spinning Z velocity.
     *
     * @readonly
     * @type {*}
     */
    readonly fieldSpinZ = input.required<number>()

    private pointsBufferRef = viewChild.required(NgtsPointsBuffer);

    private materialRef = viewChild.required(NgtsCustomShaderMaterial);

    protected readonly uniforms = computed<StarfieldUniforms>(()=>({
      time: {value: 0}
    }))

    /**
     * All possible colors a star can take.
     *
     * @readonly
     * @type {*}
     */
    readonly starColors = input.required<string[]>()

    /**
     * All possible colors a star can take as a Float32Array.
     *
     * @type {*}
     */
    protected readonly palette = computed(() => {
      const colors = this.starColors();
      const arr = new Float32Array(colors.length * 3);

      for (let i = 0; i < colors.length; i++) {
        const c = new Color(colors[i]);
        const idx = i * 3;

        arr[idx] = c.r;
        arr[idx + 1] = c.g;
        arr[idx + 2] = c.b;
      }

      return arr;
    });


  /**
   * Colors of every individual star.
   *
   * @type {*}
   */
  protected readonly colors = computed(() => {
    const palette = this.palette();
    const paletteCount = palette.length / 3;

    const arr = new Float32Array(this.count() * 3);

    for (let i = 0; i < this.count(); i++) {
      const p = ((Math.random() * paletteCount) | 0) * 3;
      const idx = i * 3;

      arr[idx] = palette[p]!;
      arr[idx + 1] = palette[p + 1]!;
      arr[idx + 2] = palette[p + 2]!;
    }

    return arr;
  });


    /**
     * Creates an instance of LandingHeroStarfieldSceneGraph. Animates the starfield spin.
     *
     * @constructor
     */
    constructor() {
      beforeRender(({ delta }) => {
        const uniforms = this.materialRef().material().uniforms as unknown as StarfieldUniforms
        uniforms.time.value += delta
        const points = this.pointsBufferRef().pointsRef().nativeElement;
        points.rotation.x += delta * this.fieldSpinX();
        points.rotation.y += delta * this.fieldSpinY();
        points.rotation.z += delta * this.fieldSpinZ();
      });
    }
}
