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
  Box3,
  MathUtils,
} from 'three/webgpu';
import type { Object3D } from 'three/webgpu';
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
let light: DirectionalLight;
let gltf: GLTFLoader;
let motorcyclist: Object3D;
let motorcyclistSrc: string = '/assets/models/motorcycle/motorcycle-opt.glb';
let resizeCanvas: ReturnType<typeof resizeCanvasFactory>;
let resizeRenderer: ReturnType<typeof resizeRendererFactory>;
let resizeCamera: ReturnType<typeof resizePrespectiveCameraFactory>;
let IMG_X_ADJUSTMENT = 0;
let IMG_Y_ADJUSTMENT = 0;
let IMG_Z_CAM_ADJUSTMENT = 1.5;
let orbitCenter = new Vector3();
let minPolar = 72.5;
let maxPolar = 75;
let minAzimuth = -2;
let maxAzimuth = 2;
let radius = IMG_Z_CAM_ADJUSTMENT;

/**
 * Motorcyclist component with slow rotation and panning to help create depth.
 */
export class MotorcyclistRenderer {
  private canvas: OffscreenCanvas;

  constructor(canvas: OffscreenCanvas, width: number, height: number) {
    this.canvas = canvas;

    resizeCanvas = resizeCanvasFactory(this.canvas);
    resizeCanvas(width, height);

    this.initScene();
  }

  /** Setup scene */
  initScene() {
    renderer = new WebGPURenderer({
      canvas: this.canvas,
      alpha: true,
    });

    resizeRenderer = resizeRendererFactory(renderer);

    const draco = new DRACOLoader();
    draco.setDecoderPath('/runtimes/three/draco/');

    gltf = new GLTFLoader();
    gltf.setDRACOLoader(draco);
    camera = new PerspectiveCamera(45, 1, 0.1, 100);
    resizeCamera = resizePrespectiveCameraFactory(camera);
    scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 0.5));
    light = new DirectionalLight(0xffffff, 1);
    light.position.set(-2, 4.5, IMG_Z_CAM_ADJUSTMENT);
    scene.add(light);
  }

  /**
   * Start rendering
   */
  async render() {
    await this.loadMotorcyclist();
    await renderer.init();
    this.animate();
  }

  /**
   * Resize handler
   */
  onResize(rect: DOMRect) {
    const { width, height } = rect;
    resizeCanvas(width, height);
    resizeRenderer(width, height, false);
    resizeCamera(width, height);
  }

  async loadMotorcyclist() {
    this.clearMotorcyclist();
    const data = await gltf.loadAsync(motorcyclistSrc);
    motorcyclist = data.scene;
    scene.add(motorcyclist);
    this.lookAtMotorcyclist();
  }

  /**
   * Find center of model
   */
  lookAtMotorcyclist() {
    const box = new Box3().setFromObject(motorcyclist);
    box.getCenter(orbitCenter);
    orbitCenter.x += IMG_X_ADJUSTMENT;
    orbitCenter.y += IMG_Y_ADJUSTMENT;
    radius = IMG_Z_CAM_ADJUSTMENT;
    camera.position.set(orbitCenter.x, orbitCenter.y, orbitCenter.z + radius);
    light.lookAt(orbitCenter);
    light.castShadow = true;
    camera.lookAt(orbitCenter);
  }

  /**
   * Smooth orbit update
   */
  private updateCamera(time: number) {
    const t = time * 0.001;
    const polarMid = MathUtils.degToRad((minPolar + maxPolar) * 0.5);

    const polarAmp = MathUtils.degToRad((maxPolar - minPolar) * 0.5);

    const azimuthMid = MathUtils.degToRad((minAzimuth + maxAzimuth) * 0.5);

    const azimuthAmp = MathUtils.degToRad((maxAzimuth - minAzimuth) * 0.5);

    const polar = polarMid + Math.sin(t * 0.5) * polarAmp;

    const azimuth = azimuthMid + Math.sin(t * 0.3) * azimuthAmp;

    const sinPhi = Math.sin(polar);

    const x = orbitCenter.x + radius * sinPhi * Math.sin(azimuth);

    const y = orbitCenter.y + radius * Math.cos(polar);

    const z = orbitCenter.z + radius * sinPhi * Math.cos(azimuth);

    camera.position.set(x, y, z);

    camera.lookAt(orbitCenter);
  }

  clearMotorcyclist() {
    if (!scene || !motorcyclist) return;

    scene.remove(motorcyclist);

    motorcyclist.traverse((obj) => {

      if (obj instanceof Mesh) {

        obj.geometry?.dispose();

        const materials = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];

        materials.forEach((material) => {

          for (const key in material) {
            const value = material[key];

            if (value && value.isTexture) {
              value.dispose();
            }
          }

          material.dispose();

        });
      }
    });

  }

  /**
   * Animation loop
   */
  private animate = (time = 0) => {
    if (!renderer || !scene || !camera) return;

    this.updateCamera(time);
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
    this.clearMotorcyclist();
    renderer?.dispose();
  }
}

expose(MotorcyclistRenderer);
