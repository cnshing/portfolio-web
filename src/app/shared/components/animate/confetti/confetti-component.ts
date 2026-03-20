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

import type { ConfettiRenderer } from '@shared/components/animate/confetti/confetti.worker';
import {
  provideThreeJSDirective,
  ThreeJSComponent,
} from '@shared/directives/three/core.directive';
import {
  ResizableWorker,
  ResizeWorkerDirective,
} from '@shared/directives/three/resizes.directive';
import { bindSignalsThreeWorkerDirective } from '@shared/directives/three/binding.directive';
import {
  DPRChangeWorker,
  DPRChangeDirective,
} from '@shared/directives/three/dpr.directive';
import { OffscreenOrbitControlsDirective, OrbitProxyWorker } from '@shared/directives/three/orbitproxy.directive';

/**
 * Three.JS animated confetti using Web Worker with OffscreenCanvas for maximum performance.
 * Uses Comlink for type-safe communication and syncToThreeCanvas for automatic Signal synchronization.
 *
 * @export
 * @class ConfettiComponent
 * @typedef {ConfettiComponent}
 */
@Component({
  selector: 'threejs-confetti',
  template: `
    <canvas
      #confettiCanvas
      style="display: block; width: 100%; height: 100%;">
    </canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    provideThreeJSDirective(ConfettiComponent)
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
    },
    {
      directive: OffscreenOrbitControlsDirective
    }
  ],
  host: {
    'class': 'pointer-events-auto block'
  }
})
export class ConfettiComponent extends ThreeJSComponent<
  ResizableWorker & DPRChangeWorker & OrbitProxyWorker
> {
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('confettiCanvas');

  threeWorker = signal<Remote<ConfettiRenderer> | undefined>(undefined);

  threeBindings = [
    'isExploding',
    'amount',
    'rate',
    'radius',
    'areaWidth',
    'areaHeight',
    'fallingHeight',
    'fallingSpeed',
    'colors',
    'pieceSize',
    'pieceSpin',
    'opacityFade',
  ];

  private destroyRef = inject(DestroyRef);

  /**
   * Enables looping explosions.
   */
  readonly isExploding = input<boolean>(true);

  /**
   * Semantic number of confetti particles.
   */
  readonly amount = input<number>(100);

  /**
   * Spawn frequency scalar.
   */
  readonly rate = input<number>(3);

  /**
   * Burst radius.
   */
  readonly radius = input<number>(15);

  /**
   * Width of the emitter area.
   */
  readonly areaWidth = input<number>(3);

  /**
   * Height variation of the emitter area.
   */
  readonly areaHeight = input<number>(1);

  /**
   * Fall distance threshold.
   */
  readonly fallingHeight = input<number>(10);

  /**
   * Controls how quickly particles descend.
   */
  readonly fallingSpeed = input<number>(8);

  /**
   * Color palette for confetti pieces.
   */
  readonly colors = input<string[]>(['#0000ff', '#ff0000', '#ffff00']);

  /**
   * Visual size of each confetti piece.
   */
  readonly pieceSize = input<number>(0.03);

  /**
   * Per-piece spin intensity.
   */
  readonly pieceSpin = input<number>(1);

  /**
   * Global opacity fade multiplier.
   */
  readonly opacityFade = input<number>(1);

  constructor() {
    super();

    afterNextRender(async () => {
      const canvas = this.canvasRef().nativeElement;
      const rect = canvas.getBoundingClientRect();
      const offscreen = canvas.transferControlToOffscreen();

      const ConfettiRenderers = wrap<typeof ConfettiRenderer>(
        new Worker(
          new URL('./confetti.worker', import.meta.url),
          { type: 'module' }
        )
      );

      this.threeWorker.set(
        await new ConfettiRenderers(
          transfer(offscreen, [offscreen]),
          rect.width,
          rect.height
        )
      );

      await this.threeWorker()!.render();
    });

    this.destroyRef.onDestroy(async () => {
      await this.cleanup();
    });
  }

  /**
   * Cleans up worker resources.
   */
  private async cleanup() {
    await this.threeWorker()?.destroy();
  }
}