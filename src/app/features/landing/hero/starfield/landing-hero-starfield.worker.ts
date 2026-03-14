/**
 * Web Worker for offscreen starfield rendering.
 * Uses Comlink class-based architecture with property setters for side effects.
 * Refactored to use TSL (Three Shading Language) with WebGPU renderer.
 */
import * as THREE from 'three/webgpu';
import { expose } from 'comlink';
import {
  resizeCanvasFactory,
  resizeRendererFactory,
  resizePrespectiveCameraFactory,
} from '@shared/utils/three';
import {
  DefaultStarfieldConfig,
  calculatePointCount,
  calculateRevealSpeed,
  calculateRevealWidth,
  generateColorPalette,
  generateStarColors,
  generateStarPositions,
} from '@features/landing/hero/starfield/landing-hero-starfield-core';
import { instancedArray, instanceIndex, uniform, varying } from 'three/tsl';
import {
  createGlowOpacityNode,
  createVertexRevealNode,
  createRotationNode,
} from '@features/landing/hero/starfield/landing-hero-starfield-shaders';

let renderer: THREE.WebGPURenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let points: THREE.Sprite;
let animationId: number;
let revealSpeedUniform: THREE.UniformNode<number>;
let revealWidthUniform: THREE.UniformNode<number>;
let fadeBiasUniform: THREE.UniformNode<number>;
let glowStrengthUniform: THREE.UniformNode<number>;
let starSizeUniform: THREE.UniformNode<number>;
let spinXUniform: THREE.UniformNode<number>;
let spinYUniform: THREE.UniformNode<number>;
let spinZUniform: THREE.UniformNode<number>;

let resizeCanvas: ReturnType<typeof resizeCanvasFactory>;
let resizeRenderer: ReturnType<typeof resizeRendererFactory>;
let resizeCamera: ReturnType<typeof resizePrespectiveCameraFactory>;

/**
 * Starfield renderer class exposed via Comlink.
 * Property setters automatically apply side effects to the Three.js scene.
 */
export class StarfieldRenderer {
  private canvas: OffscreenCanvas;
  private config = { ...DefaultStarfieldConfig };

  constructor(canvas: OffscreenCanvas, width: number, height: number) {
    this.canvas = canvas;
    resizeCanvas = resizeCanvasFactory(this.canvas);
    resizeCanvas(width, height);
    this.initScene();
  }

  /** Setups the scene. */
  initScene() {
    renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      alpha: true,
    });
    resizeRenderer = resizeRendererFactory(renderer);
    camera = new THREE.PerspectiveCamera(
      155, // fov
      1, // aspect (will be updated on first resize)
      0.0025, // near
      0.5 // far
    );
    camera.position.set(0, 0, 0.05);
    resizeCamera = resizePrespectiveCameraFactory(camera);
    scene = new THREE.Scene();
  }

  /**
   * Renders the scene.
   */
  async render() {
    // Create starfield
    this.createStarfield();

    await renderer.init();
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

    const arrays = this.createStarArrays(count);
    const uniforms = this.createStarUniforms();
    const nodes = this.createStarNodes(arrays, uniforms);

    const material = this.createStarMaterial(nodes, uniforms);
    points = this.createStarObject(material, count);

    scene.add(points);
  }

  /**
   * Create star position + color arrays
   */
  private createStarArrays(count: number) {
    const positions = generateStarPositions(count, this.config.fieldRadius);
    const palette = generateColorPalette(this.config.starColors);
    const colors = generateStarColors(count, palette);

    const starPositionArray = instancedArray(count, 'vec3');
    const starColorArray = instancedArray(count, 'vec3');

    starPositionArray.value.set(positions);
    starColorArray.value.set(colors);

    return {
      starPositionArray,
      starColorArray,
    };
  }

  /**
   * Create all shader uniforms
   */
  private createStarUniforms() {
    const revealSpeed = calculateRevealSpeed(
      this.config.fieldRadius,
      this.config.fieldEnterDuration
    );

    const revealWidth = calculateRevealWidth(revealSpeed, this.config.starEnterDuration);

    revealSpeedUniform = uniform(revealSpeed);
    revealWidthUniform = uniform(revealWidth);
    fadeBiasUniform = uniform(this.config.starFade);
    glowStrengthUniform = uniform(this.config.starGlow);
    starSizeUniform = uniform(this.config.starSize);
    spinXUniform = uniform(this.config.fieldSpinX);
    spinYUniform = uniform(this.config.fieldSpinY);
    spinZUniform = uniform(this.config.fieldSpinZ);

    return {
      revealSpeedUniform,
      revealWidthUniform,
      fadeBiasUniform,
      glowStrengthUniform,
      starSizeUniform,
      spinXUniform,
      spinYUniform,
      spinZUniform,
    };
  }

  /**
   * Build all shader nodes
   */
  private createStarNodes(arrays: any, uniforms: any) {
    const basePosition = arrays.starPositionArray.element(instanceIndex);

    const rotatedPosition = createRotationNode(
      uniforms.spinXUniform,
      uniforms.spinYUniform,
      uniforms.spinZUniform,
      basePosition
    );

    const vReveal = varying(
      createVertexRevealNode(
        uniforms.revealSpeedUniform,
        uniforms.revealWidthUniform,
        rotatedPosition
      )
    );

    const baseColor = arrays.starColorArray.element(instanceIndex);

    const vColor = varying(baseColor);

    return {
      rotatedPosition,
      vReveal,
      vColor,
    };
  }

  /**
   * Build the PointsNodeMaterial
   */
  private createStarMaterial(nodes: any, uniforms: any) {
    const material = new THREE.PointsNodeMaterial({
      transparent: true,
    });

    material.positionNode = nodes.rotatedPosition;
    material.colorNode = nodes.vColor;

    material.opacityNode = createGlowOpacityNode(
      uniforms.fadeBiasUniform,
      uniforms.glowStrengthUniform,
      nodes.vReveal
    );

    material.depthWrite = false;
    material.transparent = true;
    material.sizeNode = uniforms.starSizeUniform.mul(nodes.vReveal);
    material.sizeAttenuation = true;

    return material;
  }

  /**
   * Create the star render object
   */
  private createStarObject(material: THREE.PointsNodeMaterial, count: number) {
    const sprite = new THREE.Sprite(material);

    sprite.count = count;
    sprite.frustumCulled = false;

    return sprite;
  }
  /**
   * Recreates the starfield when major parameters change
   */
  private recreateStarfield() {
    if (points) {
      points.material.dispose();
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
      const revealSpeed = calculateRevealSpeed(
        this.config.fieldRadius,
        this.config.fieldEnterDuration
      );
      const revealWidth = calculateRevealWidth(revealSpeed, this.config.starEnterDuration);

      revealSpeedUniform.value = revealSpeed;
      revealWidthUniform.value = revealWidth;
    }
  }
}

// Expose the class via Comlink
expose(StarfieldRenderer);
