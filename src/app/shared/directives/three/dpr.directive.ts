import {
  Directive,
  inject,
  DestroyRef,
  effect,
} from '@angular/core';
import { Remote } from 'comlink';
import { ThreeJSComponent } from '@shared/directives/three/core.directive';
import type { WebGLRenderer } from 'three';
import type { WebGPURenderer } from 'three/webgpu';

export function onDPRChangeFactory(
  renderer?: WebGLRenderer | WebGPURenderer,
) {
  function updateDPR(dpr: number) {
    renderer?.setPixelRatio(dpr);
  }
  return updateDPR;
}

/**
 * A Three.JS worker that supports DPR updates
 */
export interface DPRChangeWorker {
  onDPRChange(dpr: number): Promise<void> | void;
}

@Directive({
  selector: '[offscreen-update-dpr]',
  standalone: true,
})
export class DPRChangeDirective {
  private host = inject(ThreeJSComponent) as ThreeJSComponent<DPRChangeWorker>;
  private destroyRef = inject(DestroyRef);

  private stop?: () => void;

  constructor() {
    effect(async() => {
      const worker = this.host.threeWorker();
      if (!worker) return;
      this.stop?.();
      this.stop = this.listen(worker);
      await worker.onDPRChange(window.devicePixelRatio);
    });

    this.destroyRef.onDestroy(() => {
      this.stop?.();
    });
  }

  /**
   * DPR listener from https://stackoverflow.com/a/71774031
   */
  private listen(worker: Remote<DPRChangeWorker>) {
    let killSwitch = false;

    const emit = async () => {
      if (killSwitch) return;
      await worker.onDPRChange(window.devicePixelRatio);
    };

    const subscribe = () => {
      if (killSwitch) return;

      const dpr = window.devicePixelRatio;
      const media = matchMedia(`(resolution: ${dpr}dppx)`);

      media.addEventListener(
        'change',
        () => {
          emit();
          subscribe(); // rebind with new DPR
        },
        { once: true }
      );
    };
    subscribe();
    return () => {
      killSwitch = true;
    };
  }
}
