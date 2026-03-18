import {
  Directive,
  inject,
  ElementRef,
  DestroyRef,
  effect,
  forwardRef,
  Signal,
  Type,
  isSignal,
} from '@angular/core';
import { Remote } from 'comlink';

/**
 * A Three.JS worker with a resize function
 *
 * @export
 * @interface ResizableWorker
 * @typedef {ResizableWorker}
 */
export interface ResizableWorker {
  /**
   * General purpose resize function, which at minimium contains a width and height parameter.
   *
   * @param {number} width
   * @param {number} height
   * @param {...unknown[]} args
   * @returns {(Promise<void> | void)}
   */
  resize(width: number, height: number, ...args: unknown[]): Promise<void> | void;
}


/**
 * Using any of the Three.JS directives requires you to extend this class and implement the following properties.
 *
 * @export
 * @abstract
 * @class ThreeJSComponent
 * @typedef {ThreeJSComponent}
 * @template R The underlying worker class.
 */
export abstract class ThreeJSComponent<R> {
  /**
   * There must be a signal allowing access to the Worker object.
   *
   * @abstract
   * @type {(Signal<Remote<R> | undefined>)}
   */
  abstract threeWorker: Signal<Remote<R> | undefined>;
  /**
   * If your worker has a 'stars' settable function, then placing 'stars' in this list will ensure every time your component 'stars' binding changes, an update is sent to the worker automatically, with the signal binding Three.js worker directive.
   *
   * @abstract
   * @type {?string[]}
   */
  abstract threeBindings?: string[];
  // https://stackoverflow.com/questions/46014761/how-to-access-host-component-from-directive
}

/**
 *
 * Required component provider to use any of the Three.JS directives.
 * @export
 * @template T
 * @param {Type<T>} cls The name of your class
 * @returns {{ provide: typeof ThreeJSComponent; useExisting: any; }}
 */
export function provideThreeJSDirective<T>(cls: Type<T>) {
  return { provide: ThreeJSComponent, useExisting: forwardRef(() => cls) };
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

      const { width, height } = entry.target.getBoundingClientRect();
      await worker.resize(width, height);
    });

    this.observer.observe(this.element.nativeElement);
  }
}

/**
 * Any changes in a valid signal or input binding `x` will be forwarded to the worker for any `x` in `threeBindings`. Assumes the worker[`x`] attribute is assignable.
 *
 * @export
 * @class bindSignalsThreeWorkerDirective
 * @typedef {bindSignalsThreeWorkerDirective}
 */
@Directive({
  selector: '[bind-three-js-signals]',
  standalone: true,
})
export class bindSignalsThreeWorkerDirective {

  private host = inject(ThreeJSComponent);

  /**
   * Sets up automatic effect bindings and updates worker as needed
   *
   * @constructor
   */
  constructor() {
    if (!this.host.threeBindings) return;
    const bindings = this.host.threeBindings;
    for (const binding of bindings) {
      const value = (this.host as any)[binding] as unknown; // TODO: Figure out typescript inferencing

      if (isSignal(value)) {

        effect(async () => {
          const worker = this.host.threeWorker();
          if (!worker) return;
          await ((worker as any)[binding] = value());
        });
      }
    }
  }
}
