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

/**
 * Three.JS animated confetti using Web Worker with OffscreenCanvas for maximum performance.
 * Uses Comlink for type-safe communication and syncToThreeCanvas for automatic Signal synchronization.
 *
 * Modified from https://github.com/ektogamat/r3f-confetti-component/blob/main/src/components/Confetti.js by Anderson Mancini and Romain Herault
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
    }
  ],
  host: {
    'class': 'pointer-events-none block transition-opacity duration-750',
    '[class.opacity-0]': '!isExploding()',
    '[class.opacity-100]': 'isExploding()'
  }
})
export class ConfettiComponent extends ThreeJSComponent<
  ResizableWorker & DPRChangeWorker
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
    'explodeDuration',
  ];

  private destroyRef = inject(DestroyRef);

  /**
   * Enables looping explosions.
   */
  readonly isExploding = input<boolean>(false);

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
   * Color palette for confetti pieces. NOTE: Currently, a bug makes inputting a custom color lag.
   */
  readonly colors = input<string[]>([
    '#D4AF37', '#D9A92E', '#C9B14A',
    '#C0C0C0', '#B8C2CC', '#C8C0B5',
    '#B76E79', '#C06F86', '#AD5F6B',
    '#DCDCE6', '#D6D6EA', '#E2DED8'
  ] );

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

  /**
   * How long it until the confetti burst occurs.
   */
    readonly explodeDuration = input<number>(0.35);

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
          rect.height,
          window.devicePixelRatio
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