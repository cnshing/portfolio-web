import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { wrap, type Remote, transfer } from 'comlink';
import { type MotorcyclistRenderer } from '@features/landing/hero/motorcyclist/landing-hero-motorcyclist.worker';
import { provideThreeJSDirective, ThreeJSComponent } from '@shared/directives/three/core.directive';
import { ResizableWorker, ResizeWorkerDirective } from '@shared/directives/three/resizes.directive';
import { bindSignalsThreeWorkerDirective } from '@shared/directives/three/binding.directive';
import { DPRChangeWorker, DPRChangeDirective } from '@shared/directives/three/dpr.directive';

/**
 * Three.JS animated starfield using Web Worker with OffscreenCanvas for maximum performance.
 * Uses Comlink for type-safe communication and syncToThreeCanvas for automatic Signal synchronization.
 *
 * @export
 * @class LandingMotorcyclistSceneComponent
 * @typedef {LandingHeroMotorcyclistSceneComponent}
 */
@Component({
  selector: 'landing-hero-motorcyclist-scene',
  template: `
    <canvas #motorcyclistCanvas
            style="display: block; width: 100%; height: 100%;">
    </canvas>
  `,
  standalone: true,
  providers: [
    provideThreeJSDirective(LandingMotorcyclistSceneComponent)
  ],
  hostDirectives: [
    {
      directive: ResizeWorkerDirective
    },
    {
      directive: bindSignalsThreeWorkerDirective
    },
    {
      directive: DPRChangeDirective
    }
  ]
})
export class LandingMotorcyclistSceneComponent extends ThreeJSComponent<ResizableWorker & DPRChangeWorker> {


  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('motorcyclistCanvas')


  /**
   * When the Three.JS world is completely loaded.
   *
   * @type {*}
   */
  onLoad = output<void>()

  threeWorker = signal<Remote<MotorcyclistRenderer> | undefined>(undefined);
  threeBindings = [
    ""
  ]
  private resizeObserver?: ResizeObserver;
  private destroyRef = inject(DestroyRef);

  constructor() {
    super()

    afterNextRender(async () => {
      const canvas = this.canvasRef().nativeElement;
      const rect = canvas.getBoundingClientRect();
      const offscreen = canvas.transferControlToOffscreen();
      const MotorcyclistRenderers = wrap<typeof MotorcyclistRenderer>(new Worker(
        new URL('./landing-hero-motorcyclist.worker', import.meta.url),
        { type: 'module' }
      ));
      this.threeWorker.set(await new MotorcyclistRenderers(transfer(offscreen, [offscreen]), rect.width, rect.height, window.devicePixelRatio))

      await this.threeWorker()!.render()
      this.onLoad.emit()
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
    await this.threeWorker()?.destroy()
  }
}
