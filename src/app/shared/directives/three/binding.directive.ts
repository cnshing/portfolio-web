import {
  Directive,
  inject,
  effect,
  isSignal,
} from '@angular/core';
import { ThreeJSComponent } from '@shared/directives/three/core.directive';

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
