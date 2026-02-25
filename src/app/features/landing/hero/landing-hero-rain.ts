import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

/**
 * Falling Rain component.
 *
 * @export
 * @class LandingHeroRainComponent
 * @typedef {LandingHeroRainComponent}
 */
@Component({
  selector: 'landing-hero-rain',
  imports: [],
  template: ` <canvas #rainCanvas></canvas> `,
  host: {
    class: 'absolute size-full',
    '(window:resize)': 'onResize()',
  } // TODO Use ResizeObserver
})
export class LandingHeroRainComponent {
  /**
   * How many individual raindrops particles should be animated?
   *
   * @readonly
   * @type {*}
   */
  readonly raindrops = input<number>(Math.max(Math.floor(window.innerWidth / (0.015 + 4)), 25));
  /**
   * In a 2D enviornment, how should each raindrop be rotated?
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly rotationDeg = input<number>(-17);

  private readonly host = inject(ElementRef<HTMLElement>);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('rainCanvas');

  private readonly destroyRef = inject(DestroyRef);

  private worker: Worker | null = null;

  /**
   * Helper to ensure canvasWidth is always the same width as its parent.
   *
   * @protected
   * @readonly
   * @type {number}
   */
  protected get canvasWidth(): number {
    return this.host.nativeElement.getBoundingClientRect().width;
  }

  /**
   * Helper to ensure canvasHeight is always the same height as its parent.
   *
   * @protected
   * @readonly
   * @type {number}
   */
  protected get canvasHeight(): number {
    return this.host.nativeElement.getBoundingClientRect().height;
  }

  /**
   * Creates an instance of LandingHeroRainComponent.
   *
   * @constructor
   */
  constructor() {
    afterNextRender(() => {
      this.initWorker();
    });
    effect(() => {
      this.updateRaindrops();
    });

    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }
  /**
   * Begin rain animation.
   *
   * @private
   */
  private initWorker(): void {
    // Create the worker
    this.worker = new Worker(new URL('./landing-hero-rain.worker.ts', import.meta.url), {
      type: 'module',
    });

    // Transfer the canvas to the worker
    const canvas = this.canvasRef().nativeElement;
    canvas.height = this.canvasHeight;
    canvas.width = this.canvasWidth;
    const offscreenCanvas = canvas.transferControlToOffscreen();

    // Initialize worker with canvas and configuration
    this.worker.postMessage(
      {
        type: 'init',
        data: {
          canvas: offscreenCanvas,
          raindropCount: this.raindrops(),
          rotationDeg: this.rotationDeg(),
        },
      },
      [offscreenCanvas]
    );

    // Start animation in worker
    this.worker.postMessage({ type: 'start' });
  }

  /**
   * In case the raindrop signal changes, this function will run.
   *
   * @private
   */
  private updateRaindrops(): void {
    // Notify worker to reinitialize raindrops
    if (this.worker) {
      this.worker.postMessage({
        type: 'update',
        data: {
          raindropCount: this.raindrops(),
        },
      });
    }
  }

  /** Ensures Canvas width and height are accurate */
  protected readonly onResize = () => {
    this.worker?.postMessage({
      type: 'resize',
      data: {
        width: this.canvasWidth,
        height: this.canvasHeight,
      },
    });
  };

  private cleanup(): void {
    if (this.worker) {
      this.worker.postMessage({ type: 'stop' });
      this.worker.terminate();
      this.worker = null;
    }
  }
}
