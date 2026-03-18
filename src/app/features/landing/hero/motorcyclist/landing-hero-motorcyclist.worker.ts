/**
 * Web Worker for offscreen Motorcyclist rendering.
 */
import {
  WebGPURenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Mesh,
  Vector3,
  Box3
} from 'three/webgpu';
import type {
  Object3D
} from 'three/webgpu'
import { expose } from 'comlink';
import {
  resizeCanvasFactory,
  resizeRendererFactory,
  resizePrespectiveCameraFactory,
} from '@shared/utils/three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
let renderer: WebGPURenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let animationId: number;
let gltf: GLTFLoader;
let motorcyclist: Object3D
let motorcyclistSrc: string = "/assets/models/motorcycle/motorcycle-opt.glb"
let resizeCanvas: ReturnType<typeof resizeCanvasFactory>;
let resizeRenderer: ReturnType<typeof resizeRendererFactory>;
let resizeCamera: ReturnType<typeof resizePrespectiveCameraFactory>;

/** Use these values to offset camera x, y, z to ensure the camera is pointing at the motorcyclist correctly */
let IMG_X_ADJUSTMENT = 0
let IMG_Y_ADJUSTMENT = 0
let IMG_Z_CAM_ADJUSTMENT = 1.5

export class MotorcyclistRenderer {
  private canvas: OffscreenCanvas;
  constructor(canvas: OffscreenCanvas, width: number, height: number) {
    this.canvas = canvas;
    resizeCanvas = resizeCanvasFactory(this.canvas);
    resizeCanvas(width, height);
    this.initScene();
  }

  /** Setups the scene. */
  initScene() {
    renderer = new WebGPURenderer({
      canvas: this.canvas,
      alpha: true,
    });
    resizeRenderer = resizeRendererFactory(renderer);
    const draco=new DRACOLoader()
    draco.setDecoderPath(
    "/runtimes/three/draco/"
    ) // Use node_modules draco loader from https://stackoverflow.com/a/61248523

    gltf=new GLTFLoader()
    gltf.setDRACOLoader(draco)
    motorcyclist = new Scene();
    camera = new PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );
    resizeCamera = resizePrespectiveCameraFactory(camera);
    scene = new Scene();
    scene.add(new AmbientLight(0xffffff,.7))
    const light=new DirectionalLight(0xffffff,1)
    light.position.set(3,4,2)
    scene.add(light)
  }

  /**
   * Renders the scene.
   */
  async render() {
    await this.loadMotorcyclist()
    await renderer.init()
    // Start animation loop
    this.animate();
  }

  /**
   * Resize handler using utils/three.ts functions
   */
  resize(width: number, height: number) {
    resizeCanvas(width, height);
    resizeRenderer(width, height, false);
    resizeCamera(width, height);
  }


  async loadMotorcyclist() {
    this.clearMotorcyclist()
    const data = await gltf.loadAsync(motorcyclistSrc)
    motorcyclist = data.scene
    scene.add(motorcyclist)
    this.lookAtMotorcyclist()
  }


  /** This forces a camera perspective that makes the motorcyclist look 2D. */
  lookAtMotorcyclist() {
    const box = new Box3().setFromObject(motorcyclist)
    const center = new Vector3()
    box.getCenter(center)
    center.x += IMG_X_ADJUSTMENT
    center.y += IMG_Y_ADJUSTMENT

    camera.position.set(center.x, center.y, IMG_Z_CAM_ADJUSTMENT)

    camera.lookAt(center)
  }

  clearMotorcyclist() {
    if (!scene || !motorcyclist) return
    scene.remove(motorcyclist)
    motorcyclist.traverse((mesh) => {
      if (mesh instanceof Mesh) {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    })
  }

  /**
   * Animation loop
   */
  private animate = () => {
    if (!renderer || !scene || !camera) return;

    // Rotation is now handled by TSL rotation node using time
    renderer.render(scene, camera);
    animationId = self.requestAnimationFrame(this.animate);
  };

  /**
   * Cleanup
   */
  destroy() {
    if (animationId !== null) {
      self.cancelAnimationFrame(animationId);
    }
    this.clearMotorcyclist()
    renderer?.dispose();
  }

}

// Expose the class via Comlink
expose(MotorcyclistRenderer);
