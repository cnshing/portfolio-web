import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild
} from '@angular/core';
import { wrap, type Remote, transfer } from 'comlink';
import { syncToThreeCanvas } from '@shared/utils/three';
import { StarfieldRenderer } from "./landing-hero-starfield.worker";
import { StarfieldConfig } from './landing-hero-starfield-core';

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
  standalone: true
})
export class LandingHeroStarfieldComponent {
  @ViewChild('starfieldCanvas', { static: false })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvasWorker = signal<Remote<StarfieldRenderer> | undefined>(undefined);
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
  readonly fieldSpinX = input<number>(-1/1024);

  /**
   * Spins the starfield in Y direction, as constant velocity.
   */
  readonly fieldSpinY = input<number>(1/512);

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

  /**
   * Creates the component and sets up Signal bindings to worker.
   */

  protected readonly config = computed<StarfieldConfig>(() => ({
    stars: this.stars(),
    starSize: this.starSize(),
    fieldRadius: this.fieldRadius(),
    starGlow: this.starGlow(),
    starFade: this.starFade(),
    fieldSpinX: this.fieldSpinX(),
    fieldSpinY: this.fieldSpinY(),
    fieldSpinZ: this.fieldSpinZ(),
    starColors: this.starColors(),
    fieldEnterDuration: this.fieldEnterDuration(),
    starEnterDuration: this.starEnterDuration()
  }));

  constructor() {
    // Initialize the promise and store the resolver

    // Setup Signal bindings with the promise
    syncToThreeCanvas(this, [
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
    ] as const, this.canvasWorker)

    afterNextRender(async () => {
      const canvas = this.canvasRef.nativeElement;
      const rect = canvas.getBoundingClientRect();

      // Check for OffscreenCanvas support
      if (!('transferControlToOffscreen' in canvas)) {
        console.warn('OffscreenCanvas not supported in this browser. Starfield will not render.');
        return;
      }
      const offscreen = canvas.transferControlToOffscreen();
      const StarfieldRenderers = wrap<typeof StarfieldRenderer>(new Worker(
        new URL('./landing-hero-starfield.worker', import.meta.url),
        { type: 'module' }
      ));
      this.canvasWorker.set(await new StarfieldRenderers(transfer(offscreen, [offscreen]), rect.width, rect.height, this.config()))

      await this.canvasWorker()!.render()
    })
    this.destroyRef.onDestroy(async () => {
      await this.cleanup();
    });
  }


  /**
   * Cleans up worker and resize observer.
   */
  private async cleanup()  {
    this.resizeObserver?.disconnect();
    await this.canvasWorker()?.destroy()
  }
}
