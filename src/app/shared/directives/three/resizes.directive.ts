import {
  Directive,
  inject,
  ElementRef,
  DestroyRef,
  effect,
} from '@angular/core';
import { Remote } from 'comlink';
import { ThreeJSComponent } from '@shared/directives/three/core.directive';

/**
 * A Three.JS worker with a resize function
 *
 * @export
 * @interface ResizableWorker
 * @typedef {ResizableWorker}
 */
export interface ResizableWorker {
  /**
   * General purpose resize function.
   *
   * @param {DOMRectReadOnly} rect
   * @returns {(Promise<void> | void)}
   */
  onResize(rect: DOMRectReadOnly): Promise<void> | void;
}



/**
 * Automatically resizes the offscreen canvas component based off the size of the host component.
 *
 * @export
 * @class ResizeWorkerDirective
 * @typedef {ResizeWorkerDirective}
 */
@Directive({
  selector: '[resizeWorker]',
  standalone: true,
})
export class ResizeWorkerDirective {
  /**
   * Host component native element.
   *
   * @private
   * @type {*}
   */
  private element = inject(ElementRef<HTMLElement>);
  /**
   * A Three.JS Component whose underlying worker is a `ResizableWorker`, i.e., allows resizing via a `resize()` function.
   *
   * @private
   * @type {ThreeJSComponent<ResizableWorker>}
   */
  private host = inject(ThreeJSComponent) as ThreeJSComponent<ResizableWorker>;

  private destroyRef = inject(DestroyRef);

  private observer?: ResizeObserver;

  constructor() {
    effect(() => {
      const worker = this.host.threeWorker();
      if (!worker) return;

      this.setupObserver(worker);
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  /**
   * Runs worker.resize() on resize
   *
   * @private
   * @param {Remote<ResizableWorker>} worker
   */
  private setupObserver(worker: Remote<ResizableWorker>) {
    this.observer?.disconnect();

    this.observer = new ResizeObserver(async (entries) => {
      const entry = entries[0];
      if (!entry) return;

      const rect = entry.target.getBoundingClientRect();
      await worker.onResize(rect);
    });

    this.observer.observe(this.element.nativeElement);
  }
}
