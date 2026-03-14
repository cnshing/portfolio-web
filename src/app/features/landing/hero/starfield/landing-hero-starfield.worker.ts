/**
 * Web Worker for offscreen starfield rendering.
 * Uses Comlink class-based architecture with property setters for side effects.
 * Refactored to use TSL (Three Shading Language) with WebGPU renderer.
 */
import {
  WebGPURenderer,
  Scene,
  PerspectiveCamera,
  PointsNodeMaterial,
  Sprite,
  Material
} from 'three/webgpu';
import type { UniformNode,  UniformArrayNode } from 'three/webgpu';
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
} from '@features/landing/hero/starfield/landing-hero-starfield-core';
import {
  instanceIndex,
  uniform,
  uniformArray,
  varying
} from 'three/tsl';
import {
  createGlowOpacityNode,
  createVertexRevealNode,
  createRotationNode,
  randomInSphereTSL,
  randomPaletteColorTSL,
} from '@features/landing/hero/starfield/landing-hero-starfield-shaders';

let renderer: WebGPURenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let points: Sprite;
let animationId: number;
let paletteUniform: UniformArrayNode<"color">;
let fieldRadiusUniform: UniformNode<"float", number>;
let revealSpeedUniform: UniformNode<"float", number>;
let revealWidthUniform: UniformNode<"float", number>;
let fadeBiasUniform: UniformNode<"float", number>;
let glowStrengthUniform: UniformNode<"float", number>;
let starSizeUniform: UniformNode<"float", number>;
let spinXUniform: UniformNode<"float", number>;
let spinYUniform: UniformNode<"float", number>;
let spinZUniform: UniformNode<"float", number>;

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
    renderer = new WebGPURenderer({
      canvas: this.canvas,
      alpha: true,
    });
    resizeRenderer = resizeRendererFactory(renderer);
    camera = new PerspectiveCamera(
      155, // fov
      1, // aspect (will be updated on first resize)
      0.0025, // near
      0.5 // far
    );
    camera.position.set(0, 0, 0.05);
    resizeCamera = resizePrespectiveCameraFactory(camera);
    scene = new Scene();
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

    this.initStarUniforms();

    const material = this.createStarMaterial();
    points = this.createStarObject(material, count);

    scene.add(points);
  }

    private createPalette() {
      const palette = generateColorPalette(this.config.starColors);
      return uniformArray<'color'>(palette, 'color')
    }

  /**
   * Create all shader uniforms
   */
  private initStarUniforms() {
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
    fieldRadiusUniform = uniform(this.config.fieldRadius);
    paletteUniform = this.createPalette()

  }

  private createPositionNode() {
    const basePosition = randomInSphereTSL(fieldRadiusUniform, instanceIndex);

    const rotatedPosition = createRotationNode(
      spinXUniform,
      spinYUniform,
      spinZUniform,
      basePosition
    );
    return rotatedPosition
  }

  private createColorNode() {
    const color = randomPaletteColorTSL(
      instanceIndex,
      paletteUniform,
    );

    return varying<"vec3">(color);
  }

  /**
   * Build the PointsNodeMaterial
   */
  private createStarMaterial() {
    const material = new PointsNodeMaterial({
      transparent: true,
    });
    const rotatedPosition = this.createPositionNode()
    material.positionNode = rotatedPosition
    material.colorNode = this.createColorNode()
    const vReveal = varying(
      createVertexRevealNode(
        revealSpeedUniform,
        revealWidthUniform,
        rotatedPosition
      )
    );
    material.opacityNode = createGlowOpacityNode(
      fadeBiasUniform,
      glowStrengthUniform,
      vReveal
    );

    material.depthWrite = false;
    material.transparent = true;
    material.sizeNode = starSizeUniform.mul(vReveal);
    material.sizeAttenuation = true;

    return material;
  }

  /**
   * Create the star render object
   */
  private createStarObject(material: PointsNodeMaterial, count: number) {
    const sprite = new Sprite(material);

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
      (points.material as Material).dispose();
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

      if (fieldRadiusUniform) {
        fieldRadiusUniform.value = value;
      }

      this.updateRevealParameters();
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
      paletteUniform.array = generateColorPalette(value)
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
