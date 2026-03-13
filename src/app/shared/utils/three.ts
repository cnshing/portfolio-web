import type { WebGLRenderer, PerspectiveCamera}  from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import { effect, isSignal, Signal } from '@angular/core';
import type { Remote } from 'comlink';

export function syncToThreeCanvas<
  T extends object,
  W extends object,
  K extends keyof T & keyof W
>(
  self: T,
  bindings: readonly K[],
  canvasWorker: Signal<Remote<W>|undefined>
) {
  for (const key of bindings) {
    const value = self[key]
    if (isSignal(value)) {
      effect(async () => {
        const canvas = canvasWorker()
        if (canvas) {
          await ((canvas as any)[key] = value());
        }
      });
    }
  }
}


export type resizeParameters = [
  width: number,
  height: number,
  updateStyle?: boolean,
]

export function bindCanvas(worker: Worker) {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;

    const { width, height } = entry.contentRect;

    worker?.postMessage({
      type: "resize",
      width: Math.floor(width),
      height: Math.floor(height)
    });
  });
  return () => observer.disconnect()
}

export function resizeCanvasFactory(canvas?: OffscreenCanvas) {
  function resize(...args: resizeParameters) {
    const [width, height] = args
    if (canvas) {
      canvas.width = width
      canvas.height = height
    }
  }
  return resize
}

export function resizeRendererFactory(renderer?: WebGLRenderer | WebGPURenderer) {
  function resize(...args: resizeParameters) {
    const [width, height, updateStyle] = args
    renderer?.setSize(width, height, updateStyle)
  }
  return resize
}

export function resizePrespectiveCameraFactory(camera?: PerspectiveCamera) {
  function resize(...args: resizeParameters) {
    const [width, height] = args
    if (camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix();
    }
  }
  return resize
}

