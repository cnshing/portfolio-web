import type { WebGLRenderer, PerspectiveCamera}  from 'three';
import type { WebGPURenderer } from 'three/webgpu';

export type resizeParameters = [
  width: number,
  height: number,
  updateStyle?: boolean,
]

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
