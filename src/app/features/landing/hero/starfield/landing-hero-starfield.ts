import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { wrap, type Remote, transfer } from 'comlink';
import { StarfieldRenderer } from "@features/landing/hero/starfield/landing-hero-starfield.worker";
import { provideThreeJSDirective, ThreeJSComponent } from '@shared/directives/three/core.directive';
import { ResizableWorker, ResizeWorkerDirective } from '@shared/directives/three/resizes.directive';
import { bindSignalsThreeWorkerDirective } from '@shared/directives/three/binding.directive';
import { OffscreenOrbitControlsDirective, OrbitProxyWorker } from '@shared/directives/three/orbitproxy.directive';
import { isTouchDevice } from '@shared/utils/accessibility';

/**
 * Three.JS animated starfield using Web Worker with OffscreenCanvas for maximum performance.
 * Uses Comlink for type-safe communication and syncToThreeCanvas for automatic Signal synchronization.
 *
 * @export
 * @class LandingHeroStarfieldComponent
 * @typedef {LandingHeroStarfieldComponent}
 */
@Component({
  selector: 'landing-hero-starfield',
  template: `
    <canvas #starfieldCanvas
            style="display: block; width: 100%; height: 100%;">
    </canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    provideThreeJSDirective(LandingHeroStarfieldComponent)
  ],
  hostDirectives: [
    {
      directive: ResizeWorkerDirective
    },
    {
      directive: bindSignalsThreeWorkerDirective
    },
    {
      directive: OffscreenOrbitControlsDirective
    }
  ],
  host: {
    'class': 'pointer-events-auto',
    // Prevent orbitcontrols from scroll jacking mobile users
    '[class.touch-pan-y]': 'isTouchDevice'
  }
})
export class LandingHeroStarfieldComponent extends ThreeJSComponent<ResizableWorker & OrbitProxyWorker> {


  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('starfieldCanvas')

  threeWorker = signal<Remote<StarfieldRenderer> | undefined>(undefined);
  threeBindings = [
    "stars",
    "starSize",
    "fieldRadius",
    "starGlow",
    "starFade",
    "fieldSpinX",
    "fieldSpinY",
    "fieldSpinZ",
    "starColors",
    "fieldEnterDuration",
    "starEnterDuration"
  ]
  private resizeObserver?: ResizeObserver;
  private destroyRef = inject(DestroyRef);

  /**
   * How many stars in the starfield.
   */
  readonly stars = input<number>(100);

  /**
   * How big each stars are.
   */
  readonly starSize = input<number>(0.001);

  /**
   * Size of the actual starfield.
   */
  readonly fieldRadius = input<number>(0.5);

  /**
   * Small decimal value to control glow softness and size, increases as starGlow gets bigger.
   */
  readonly starGlow = input<number>(0.2);

  /**
   * Small decimal value to control fade sharpness for star glow, where the falloff gets sharper as starFade gets lower.
   */
  readonly starFade = input<number>(0.1);

  /**
   * Spins the starfield in X direction, as constant velocity.
   */
  readonly fieldSpinX = input<number>(1/128);

  /**
   * Spins the starfield in Y direction, as constant velocity.
   */
  readonly fieldSpinY = input<number>(1/128);

  /**
   * Spins the starfield in Z direction, as constant velocity.
   */
  readonly fieldSpinZ = input<number>(1/256);

  /**
   * Any individual star will select from any of the following colors.
   */
  readonly starColors = input<string[]>(['white']);

  /**
   * Duration (in seconds) for the entire starfield to be revealed.
   * The reveal sphere expands from the camera to cover the entire fieldRadius in this time.
   */
  readonly fieldEnterDuration = input<number>(0.75);

  /**
   * Duration (in seconds) for each individual star to grow from invisible to full size.
   * Controls the width of the reveal transition band.
   */
  readonly starEnterDuration = input<number>(2.25);

  constructor() {
    super()

    afterNextRender(async () => {
      const canvas = this.canvasRef().nativeElement;
      const rect = canvas.getBoundingClientRect();
      const offscreen = canvas.transferControlToOffscreen();
      const StarfieldRenderers = wrap<typeof StarfieldRenderer>(new Worker(
        new URL('./landing-hero-starfield.worker', import.meta.url),
        { type: 'module' }
      ));
      this.threeWorker.set(await new StarfieldRenderers(transfer(offscreen, [offscreen]), rect.width, rect.height))
      await this.threeWorker()!.render()
    })
    this.destroyRef.onDestroy(async () => {
      await this.cleanup();
    });
  }

  protected readonly isTouchDevice = isTouchDevice()

  /**
   * Cleans up worker and resize observer.
   */
  private async cleanup()  {
    this.resizeObserver?.disconnect();
    await this.threeWorker()?.destroy()
  }
}
