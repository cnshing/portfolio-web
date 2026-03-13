/**
 * Web Worker for offscreen starfield rendering.
 * Uses Comlink class-based architecture with property setters for side effects.
 * Refactored to use TSL (Three Shading Language) with WebGPU renderer.
 */
import * as THREE from 'three/webgpu';
import { expose } from 'comlink';
import { resizeCanvasFactory, resizeRendererFactory, resizePrespectiveCameraFactory } from '@shared/utils/three';
import {
  DefaultStarfieldConfig,
  StarfieldConfig,
  calculatePointCount,
  calculateRevealSpeed,
  calculateRevealWidth,
  generateColorPalette,
  generateStarColors,
  generateStarPositions
} from './landing-hero-starfield-core';
import {  instancedArray, instanceIndex, uniform, varying } from 'three/tsl';
import { createFragmentNode, createVertexRevealNode, createRotationNode } from './landing-hero-starfield-shaders';


let renderer: THREE.WebGPURenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let points: THREE.Sprite
let animationId: number
let revealSpeedUniform: THREE.UniformNode<number>
let revealWidthUniform: THREE.UniformNode<number>
let fadeBiasUniform: THREE.UniformNode<number>
let glowStrengthUniform: THREE.UniformNode<number>
let starSizeUniform: THREE.UniformNode<number>
let spinXUniform: THREE.UniformNode<number>
let spinYUniform: THREE.UniformNode<number>
let spinZUniform: THREE.UniformNode<number>

let resizeCanvas: ReturnType<typeof resizeCanvasFactory>
let resizeRenderer: ReturnType<typeof resizeRendererFactory>
let resizeCamera: ReturnType<typeof resizePrespectiveCameraFactory>

/**
 * Starfield renderer class exposed via Comlink.
 * Property setters automatically apply side effects to the Three.js scene.
 */
export class StarfieldRenderer {

  private canvas: OffscreenCanvas
  private config = {...DefaultStarfieldConfig}

  constructor(canvas: OffscreenCanvas, width: number, height: number, config: StarfieldConfig) {
    this.canvas = canvas
    resizeCanvas = resizeCanvasFactory(this.canvas)
    resizeCanvas(width, height)
    this.config = {
      ...config
    }
    this.init()
  }

  init() {
    renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      alpha: true
    })
    resizeRenderer = resizeRendererFactory(renderer)
    camera = new THREE.PerspectiveCamera(
      155, // fov
      1, // aspect (will be updated on first resize)
      0.00125, // near
      0.45 // far
    );
    camera.position.set(0, 0, 0.05);
    resizeCamera = resizePrespectiveCameraFactory(camera);
  }

  /**
   * Initializes the renderer with canvas and configuration
   */
  async render() {

    // Setup scene
    scene = new THREE.Scene();

    // Create starfield
    this.createStarfield();


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

  /**
   * Creates the starfield point cloud with TSL (Three Shading Language)
   */
  private createStarfield() {
    if (!scene || !camera) return;

    const count = calculatePointCount(this.config.stars);
    const positions = generateStarPositions(count, this.config.fieldRadius);
    const palette = generateColorPalette(this.config.starColors);
    const colors = generateStarColors(count, palette);

    const starPositionArray = instancedArray(count, 'vec3');
    const starColorArray = instancedArray(count, 'vec3');

    starPositionArray.value.set(positions);
    starColorArray.value.set(colors);

    // Create TSL uniforms
    const revealSpeed = calculateRevealSpeed(this.config.fieldRadius, this.config.fieldEnterDuration);
    const revealWidth = calculateRevealWidth(revealSpeed, this.config.starEnterDuration);

    revealSpeedUniform = uniform(revealSpeed);
    revealWidthUniform = uniform(revealWidth);
    fadeBiasUniform = uniform(this.config.starFade);
    glowStrengthUniform = uniform(this.config.starGlow);
    starSizeUniform = uniform(this.config.starSize);
    spinXUniform = uniform(this.config.fieldSpinX);
    spinYUniform = uniform(this.config.fieldSpinY);
    spinZUniform = uniform(this.config.fieldSpinZ);

    const basePosition = starPositionArray.element(instanceIndex);
    const rotatedPosition = createRotationNode(
      spinXUniform,
      spinYUniform,
      spinZUniform,
      basePosition
    );

    // Create reveal node using TSL with rotated position
    const vReveal = varying(
      createVertexRevealNode(
        revealSpeedUniform,
        revealWidthUniform,
        rotatedPosition
      )
    );
    console.log(vReveal)
    const baseColor = starColorArray.element(instanceIndex);

    const vColor = varying(baseColor);

    const material = new THREE.PointsNodeMaterial({
      transparent: true
    });

    material.positionNode = rotatedPosition;
    material.colorNode = vColor;
    material.opacityNode = createFragmentNode(fadeBiasUniform, glowStrengthUniform, vReveal)
    material.depthWrite = false
    material.transparent = true;
    material.sizeNode = starSizeUniform.mul(vReveal)
    material.sizeAttenuation = true;

    console.log(createFragmentNode)

    points = new THREE.Sprite(material);
    points.count = count;
    points.frustumCulled = false;

    scene.add(points);
  }

  /**
   * Recreates the starfield when major parameters change
   */
  private recreateStarfield() {
    if (points) {
      (points.material as THREE.Material).dispose();
      scene?.remove(points);
    }
    this.createStarfield();
  }

  /**
   * Animation loop
   */
  private animate = () => {
    if (!renderer || !scene || !camera || !points) return;

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

    if (points) {
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
      scene?.remove(points);
    }

    renderer?.dispose();
  }

  // Getter/Setter pairs with side effects

  set stars(value: number) {
    if (this.config.stars !== value) {
      this.config.stars = value;
      this.recreateStarfield();
    }
  }

  set starSize(value: number) {
    this.config.starSize = value;
    if (starSizeUniform) {
      starSizeUniform.value = value;
    }
  }

  set fieldRadius(value: number) {
    if (this.config.fieldRadius !== value) {
      this.config.fieldRadius = value;
      this.updateRevealParameters();
      this.recreateStarfield();
    }
  }

  set starGlow(value: number) {
    this.config.starGlow = value;
    if (glowStrengthUniform) {
      glowStrengthUniform.value = value;
    }
  }

  set starFade(value: number) {
    this.config.starFade = value;
    if (fadeBiasUniform) {
      fadeBiasUniform.value = value;
    }
  }

  set fieldSpinX(value: number) {
    this.config.fieldSpinX = value;
    if (spinXUniform) {
      spinXUniform.value = value;
    }
  }

  set fieldSpinY(value: number) {
    this.config.fieldSpinY = value;
    if (spinYUniform) {
      spinYUniform.value = value;
    }
  }

  set fieldSpinZ(value: number) {
    this.config.fieldSpinZ = value;
    if (spinZUniform) {
      spinZUniform.value = value;
    }
  }

  set starColors(value: string[]) {
    if (JSON.stringify(this.config.starColors) !== JSON.stringify(value)) {
      this.config.starColors = value;
      this.recreateStarfield();
    }
  }

  set fieldEnterDuration(value: number) {
    this.config.fieldEnterDuration = value;
    this.updateRevealParameters();
  }

  set starEnterDuration(value: number) {
    this.config.starEnterDuration = value;
    this.updateRevealParameters();
  }

  /**
   * Updates reveal animation parameters using TSL uniforms
   */
  private updateRevealParameters() {
    if (revealSpeedUniform && revealWidthUniform) {
      const revealSpeed = calculateRevealSpeed(this.config.fieldRadius, this.config.fieldEnterDuration);
      const revealWidth = calculateRevealWidth(revealSpeed, this.config.starEnterDuration);

      revealSpeedUniform.value = revealSpeed;
      revealWidthUniform.value = revealWidth;
    }
  }
}

// Expose the class via Comlink
expose(StarfieldRenderer);
