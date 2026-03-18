import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { wrap, type Remote, transfer } from 'comlink';
import { type MotorcyclistRenderer } from '@features/landing/hero/motorcyclist/landing-hero-motorcyclist.worker';
import { ThreeJSComponent, ResizeWorkerDirective, ResizableWorker, bindSignalsThreeWorkerDirective, provideThreeJSDirective } from '@shared/directives/three.directive';

/**
 * Three.JS animated starfield using Web Worker with OffscreenCanvas for maximum performance.
 * Uses Comlink for type-safe communication and syncToThreeCanvas for automatic Signal synchronization.
 *
 * @export
 * @class LandingHeroStarfieldComponent
 * @typedef {LandingHeroStarfieldComponent}
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
    }
  ]
})
export class LandingMotorcyclistSceneComponent extends ThreeJSComponent<ResizableWorker> {


  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('motorcyclistCanvas')

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
      this.threeWorker.set(await new MotorcyclistRenderers(transfer(offscreen, [offscreen]), rect.width, rect.height))

      await this.threeWorker()!.render()
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
