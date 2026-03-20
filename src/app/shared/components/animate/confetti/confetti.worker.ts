/**
 * Web Worker for offscreen confetti rendering.
 * Structured as looping grouped "booms".
 */
import {
  WebGPURenderer,
  Scene,
  PerspectiveCamera,
  InstancedMesh,
  MeshBasicNodeMaterial,
  Material,
  PlaneGeometry,
  DoubleSide,
  Matrix4
} from 'three/webgpu';
import type { UniformArrayNode, UniformNode, Node } from 'three/webgpu';
import { expose } from 'comlink';

import {
  instanceIndex,
  positionLocal,
  uniform,
  uniformArray,
  varying,
  vec3,
  float,
  hash,
  mix,
  mod,
  time,
  rotate,
  floor,
} from 'three/tsl';

import {
  resizeCanvasFactory,
  resizeRendererFactory,
  resizePrespectiveCameraFactory,
} from '@shared/utils/three';
import { onDPRChangeFactory } from '@shared/directives/three/dpr.directive';

import {
  DefaultConfettiConfig,
  generateColorPalette,
} from '@shared/components/animate/confetti/confetti-core';

import {
  calculateEmitterHeight,
  calculateParticleLife,
  calculateSpawnWindow,
  calculateTotalParticleCount,
  calculateGravityRange,
  calculateBoomCount,
} from '@shared/components/animate/confetti/confetti-physics';

import {
  createConfettiFragmentShapeNode,
  createConfettiOpacityNode,
  createConfettiPositionNode,
  createConfettiRotationNode,
  randomPaletteColorTSL,
} from '@shared/components/animate/confetti/confetti-shaders';

let renderer: WebGPURenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let particles: InstancedMesh;
let animationId: number | null = null;

let paletteUniform: UniformArrayNode<'color'>;
let isExplodingUniform: UniformNode<'float', number>;
let radiusUniform: UniformNode<'float', number>;
let areaWidthUniform: UniformNode<'float', number>;
let areaHeightUniform: UniformNode<'float', number>;
let emitterHeightUniform: UniformNode<'float', number>;
let pieceSizeUniform: UniformNode<'float', number>;
let pieceSpinUniform: UniformNode<'float', number>;
let opacityFadeUniform: UniformNode<'float', number>;

let fallingSpeedUniform: UniformNode<'float', number>;
let gravityMinUniform: UniformNode<'float', number>;
let gravityMaxUniform: UniformNode<'float', number>;
let explodeDurationUniform: UniformNode<'float', number>;
let particleLifeUniform: UniformNode<'float', number>;
let spawnWindowUniform: UniformNode<'float', number>;
let resizeCanvas: ReturnType<typeof resizeCanvasFactory>;
let resizeRenderer: ReturnType<typeof resizeRendererFactory>;
let resizeCamera: ReturnType<typeof resizePrespectiveCameraFactory>;
let dprRenderer: ReturnType<typeof onDPRChangeFactory>;

export class ConfettiRenderer {
  private canvas: OffscreenCanvas;
  private config = { ...DefaultConfettiConfig };

  constructor(canvas: OffscreenCanvas, width: number, height: number) {

    this.canvas = canvas;

    resizeCanvas = resizeCanvasFactory(this.canvas);
    resizeCanvas(width, height);

    this.initScene();
  }

  initScene() {
    renderer = new WebGPURenderer({
      canvas: this.canvas,
      alpha: true,
    });

    resizeRenderer = resizeRendererFactory(renderer);
    camera = new PerspectiveCamera(45, 1, 0.0001, 10);
    camera.position.set(0, 6.5,-1);
    scene = new Scene();
    dprRenderer = onDPRChangeFactory(renderer);
    resizeCamera = resizePrespectiveCameraFactory(camera);
    camera.lookAt(0,18.5,5);
  }

  onDPRChange(dpr: number) {
    dprRenderer(dpr);
  }

  async render() {
    this.createConfetti();
    await renderer.init();
    this.animate();
  }

  onResize(rect: DOMRectReadOnly) {
    const { width, height } = rect;
    resizeCanvas(width, height);
    resizeRenderer(width, height, false);
    resizeCamera(width, height);
  }

  private createConfetti() {
    if (!scene || !camera) return;

    const count = calculateTotalParticleCount(
      this.config.amount,
      this.config.rate,
      this.config.fallingHeight,
      this.config.areaHeight,
      this.config.fallingSpeed,
      this.config.radius
    );

    this.initConfettiUniforms();

    const material = this.createConfettiMaterial();
    particles = this.createConfettiObject(material, count);
    scene.add(particles);
  }

  private createPalette() {
    const palette = generateColorPalette(this.config.colors);
    return uniformArray<'color'>(palette, 'color');
  }

  private initConfettiUniforms() {
    const { gravityMin, gravityMax } =
      calculateGravityRange(this.config.fallingSpeed);

    isExplodingUniform = uniform(this.config.isExploding ? 1 : 0);
    radiusUniform = uniform(this.config.radius);
    areaWidthUniform = uniform(this.config.areaWidth);
    areaHeightUniform = uniform(this.config.areaHeight);

    emitterHeightUniform = uniform(
      calculateEmitterHeight(
        this.config.fallingHeight,
        this.config.areaHeight,
        this.config.fallingSpeed
      )
    );

    pieceSizeUniform = uniform(this.config.pieceSize);
    pieceSpinUniform = uniform(this.config.pieceSpin);
    opacityFadeUniform = uniform(this.config.opacityFade);

    fallingSpeedUniform = uniform(this.config.fallingSpeed);
    gravityMinUniform = uniform(gravityMin);
    gravityMaxUniform = uniform(gravityMax);
    explodeDurationUniform = uniform(this.config.explodeDuration);

    particleLifeUniform = uniform(
      calculateParticleLife(
        this.config.fallingHeight,
        this.config.areaHeight,
        this.config.fallingSpeed,
        this.config.radius
      )
    );

    spawnWindowUniform = uniform(
      calculateSpawnWindow(this.config.rate)
    );

    paletteUniform = this.createPalette();
  }

  private createBoomIdNode() {
    const particlesPerBoom = float(Math.max(1, Math.floor(this.config.amount)));
    return floor(float(instanceIndex).div(particlesPerBoom));
  }

  private createLocalParticleIdNode() {
    const particlesPerBoom = float(Math.max(1, Math.floor(this.config.amount)));
    return mod(float(instanceIndex), particlesPerBoom);
  }

  private createSpawnTimeNode(boomId: Node<"float">) {
    // Each boom spawns at sequential intervals: boomId * spawnWindow
    // This makes rate directly control explosion frequency
    const baseOffset = boomId.mul(spawnWindowUniform);

    // Total number of booms in the pool
    const boomCount = float(
      calculateBoomCount(
        this.config.rate,
        this.config.fallingHeight,
        this.config.areaHeight,
        this.config.fallingSpeed,
        this.config.radius
      )
    );

    // Cycle duration: time for all booms to spawn once
    const cycleDuration = boomCount.mul(spawnWindowUniform);

    // Calculate which cycle we're in (0, 1, 2, ...) for this boom
    const timeSinceStart = time.sub(baseOffset);
    const currentCycle = floor(timeSinceStart.div(cycleDuration));

    // Return the most recent spawn time for this boom
    return baseOffset.add(currentCycle.mul(cycleDuration));
  }

  private createOriginNode(boomId: Node<"float">, spawnTime: Node<"float">) {
    // Incorporate spawn time into hash to get unique positions per cycle
    return vec3(
      mix(
        areaWidthUniform.mul(-0.5),
        areaWidthUniform.mul(0.5),
        hash(boomId.add(spawnTime).add(11.1))
      ),
      emitterHeightUniform,
      mix(
        areaWidthUniform.mul(-0.5),
        areaWidthUniform.mul(0.5),
        hash(boomId.add(spawnTime).add(17.3))
      )
    );
  }

  private createDestinationNode(localId: Node<"float">) {
    const rx = hash(localId.add(23.1));
    const ry = hash(localId.add(29.7));
    const rz = hash(localId.add(31.9));

    const sx = hash(localId.add(41.1)).sub(0.5).mul(radiusUniform.mul(2.0)).mul(rx);
    const sy = hash(localId.add(43.7)).sub(0.5).mul(radiusUniform.mul(2.0)).mul(ry);
    const sz = hash(localId.add(47.3)).sub(0.5).mul(radiusUniform.mul(2.0)).mul(rz);

    return vec3(sx, sy, sz);
  }

  private createEuler0Node(localId: Node<"float">) {
    const tau = Math.PI * 2;

    return vec3(
      hash(localId.add(53.1)).mul(tau),
      hash(localId.add(59.7)).mul(tau),
      hash(localId.add(61.9)).mul(tau)
    );
  }

  private createSpinNode(localId: Node<"float">) {
    return vec3(
      mix(pieceSpinUniform.negate(), pieceSpinUniform, hash(localId.add(67.1))),
      mix(pieceSpinUniform.negate(), pieceSpinUniform, hash(localId.add(71.7))),
      mix(pieceSpinUniform.negate(), pieceSpinUniform, hash(localId.add(73.9)))
    );
  }

  private createColorNode(localId: Node<"float">) {
    const color = randomPaletteColorTSL(localId, paletteUniform);
    return varying<'vec3'>(color);
  }

  private createConfettiMaterial() {
    const material = new MeshBasicNodeMaterial({
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });

    const boomId = this.createBoomIdNode();
    const localId = this.createLocalParticleIdNode();

    const spawnTimeNode = this.createSpawnTimeNode(boomId);
    const originNode = this.createOriginNode(boomId, spawnTimeNode);
    const destinationNode = this.createDestinationNode(localId);
    const euler0Node = this.createEuler0Node(localId);
    const spinNode = this.createSpinNode(localId);

    const rotatedLocal = createConfettiRotationNode(
      positionLocal,
      euler0Node,
      spinNode,
      spawnTimeNode
    );

    const rotatedNormal = rotate(
      vec3(0.0, 0.0, 1.0),
      euler0Node.add(spinNode.mul(time.sub(spawnTimeNode)))
    );

    const positionNode = createConfettiPositionNode(
      rotatedLocal,
      originNode,
      destinationNode,
      spawnTimeNode,
      particleLifeUniform,
      pieceSizeUniform,
      fallingSpeedUniform,
      gravityMinUniform,
      gravityMaxUniform,
      explodeDurationUniform,
      localId
    );

    material.positionNode = positionNode;
    material.colorNode = this.createColorNode(localId);
    material.opacityNode = createConfettiOpacityNode(
      spawnTimeNode,
      particleLifeUniform,
      rotatedNormal
    )
      .mul(createConfettiFragmentShapeNode())
      .mul(opacityFadeUniform)
      .mul(isExplodingUniform);

    return material;
  }

  private createConfettiObject(
    material: MeshBasicNodeMaterial,
    count: number
  ) {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    const mesh = new InstancedMesh(geometry, material, count);

    const identity = new Matrix4();
    for (let i = 0; i < count; i++) {
      mesh.setMatrixAt(i, identity);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;

    return mesh;
  }

  private recreateConfetti() {
    if (particles) {
      particles.geometry.dispose();
      (particles.material as Material).dispose();
      scene?.remove(particles);
    }

    this.createConfetti();
  }

  private updateDerivedParameters() {
    const { gravityMin, gravityMax } =
      calculateGravityRange(this.config.fallingSpeed);

    if (fallingSpeedUniform) {
      fallingSpeedUniform.value = this.config.fallingSpeed;
    }

    if (gravityMinUniform) {
      gravityMinUniform.value = gravityMin;
    }

    if (gravityMaxUniform) {
      gravityMaxUniform.value = gravityMax;
    }

    if (emitterHeightUniform) {
      emitterHeightUniform.value = calculateEmitterHeight(
        this.config.fallingHeight,
        this.config.areaHeight,
        this.config.fallingSpeed
      );
    }

    if (particleLifeUniform) {
      particleLifeUniform.value = calculateParticleLife(
        this.config.fallingHeight,
        this.config.areaHeight,
        this.config.fallingSpeed,
        this.config.radius
      );
    }

    if (spawnWindowUniform) {
      spawnWindowUniform.value = calculateSpawnWindow(
        this.config.rate
      );
    }
  }

  private animate = () => {
    if (!renderer || !scene || !camera || !particles) return;
    renderer.render(scene, camera);
    animationId = self.requestAnimationFrame(this.animate);
  };

  destroy() {
    if (animationId !== null) {
      self.cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (particles) {
      particles.geometry.dispose();
      (particles.material as Material).dispose();
      scene?.remove(particles);
    }

    renderer?.dispose();
  }

  set isExploding(value: boolean) {
    this.config.isExploding = value;

    if (isExplodingUniform) {
      isExplodingUniform.value = value ? 1 : 0;
    }
  }

  set amount(value: number) {
    if (this.config.amount !== value) {
      this.config.amount = value;
      this.recreateConfetti();
    }
  }

  set explodeDuration(value: number) {
    this.config.explodeDuration = value
    explodeDurationUniform.value = value
  }

  set rate(value: number) {
    if(this.config.rate !== value) {
      this.config.rate = value;
      if (spawnWindowUniform) {
        spawnWindowUniform.value = calculateSpawnWindow(value);
      }
      this.recreateConfetti()
    }
  }

  set radius(value: number) {
    this.config.radius = value;

    if (radiusUniform) {
      radiusUniform.value = value;
    }
  }

  set areaWidth(value: number) {
    this.config.areaWidth = value;

    if (areaWidthUniform) {
      areaWidthUniform.value = value;
    }
  }

  set areaHeight(value: number) {
    this.config.areaHeight = value;

    if (areaHeightUniform) {
      areaHeightUniform.value = value;
    }

    this.updateDerivedParameters();
  }

  set fallingHeight(value: number) {
    this.config.fallingHeight = value;
    this.updateDerivedParameters();
  }

  set fallingSpeed(value: number) {
    this.config.fallingSpeed = value;
    this.updateDerivedParameters();
  }

  set colors(value: string[]) {
    if (JSON.stringify(this.config.colors) !== JSON.stringify(value)) {
      this.config.colors = value;

      if (paletteUniform) {
        paletteUniform.array = generateColorPalette(value);
      }

      this.recreateConfetti();
    }
  }

  set pieceSize(value: number) {
    this.config.pieceSize = value;

    if (pieceSizeUniform) {
      pieceSizeUniform.value = value;
    }
  }

  set pieceSpin(value: number) {
    this.config.pieceSpin = value;

    if (pieceSpinUniform) {
      pieceSpinUniform.value = value;
    }
  }

  set opacityFade(value: number) {
    this.config.opacityFade = value;

    if (opacityFadeUniform) {
      opacityFadeUniform.value = value;
    }
  }
}

expose(ConfettiRenderer);