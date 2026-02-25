export interface Range {
  min: number;
  max: number;
}

/**
 * Raindrop State.
 *
 * @interface Raindrop
 * @typedef {Raindrop}
 */
interface Raindrop {
  /**
   * Initial X position of the raindrop.
   *
   * @type {number}
   */
  x: number;
  /**
   * Initial Y position of the raindrop.
   *
   * @type {number}
   */
  y: number;
  /**
   * Y speed.
   *
   * @type {number}
   */
  speed: number;
  /**
   * Speed of raindrop in X direction.
   *
   * @type {number}
   */
  xSpeed: number;
  length: number;
  width: number;
  color: string;
}

/**
 * Configuration data for Rain Engine.
 *
 * @export
 * @interface RainConfig
 * @typedef {RainConfig}
 */
export interface RainConfig {
  canvas: OffscreenCanvas;

  /**
   * Total number of particles to animate.
   *
   * @type {number}
   */
  raindropCount: number;
  /**
   * Mathematical representation of rain "wind" effect
   *
   * @type {number}
   */
  rotationDeg: number;
  /**
   * Total available of raindrop colours to choose from
   *
   * @type {string[]}
   */
  availableColors: string[];

  /**
   * How long it takes for each raindrop to pass.
   *
   * @type {Range}
   */
  durationRange: Range;
  /**
   * A range of how wide a raindrop can be.
   *
   * @type {Range}
   */
  raindropWidthRange: Range;
  /**
   * A range of how long a raindrop can be.
   *
   * @type {Range}
   */
  raindropLengthRange: Range;
}

/**
 * Synchronization constant
 *
 * @type {100}
 */
const MAX_DELTA_TIME = 100;

const DEFAULT_WORKER_CONFIG: Partial<RainConfig> = {
  raindropCount: 120,
  rotationDeg: 17,
  availableColors: ['#374151', '#4b5563'],

  durationRange: { min: 2200, max: 2600 },
  raindropWidthRange: { min: 0.0001, max: 0.0002 },
  raindropLengthRange: { min: 0.01, max: 0.015 },
};

/**
 * Converts a degree to radians.
 *
 * @param {number} deg
 * @returns {number}
 */
const degToRad = (deg: number) => (deg * Math.PI) / 180;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Returns an element of `T` where each individual element has a equal probability of returning.
 *
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
const chooseRandomlyFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

class RainEngine {
  private ctx: OffscreenCanvasRenderingContext2D;
  /**
   * Number of raindrops required to animate
   *
   * @private
   * @type {Raindrop[]}
   */
  private drops: Raindrop[] = [];
  /**
   * Animation reference.
   *
   * @private
   * @type {(number | null)}
   */
  private animationId: number | null = null;
  /**
   * Previous time reference.
   *
   * @private
   * @type {number}
   */
  private lastTime = 0;

  private rotationRad = degToRad(17);
  private durationRange!: Range;
  private widthRange!: Range;
  private lengthRange!: Range;
  private colors!: string[];

  /** Get canvas width */
  private get width(): number {
    return this.ctx.canvas.width;
  }

  /** Get canvas height */
  private get height(): number {
    return this.ctx.canvas.height;
  }

  /**
   * Creates an instance of RainEngine.
   *
   * @constructor
   * @param {OffscreenCanvasRenderingContext2D} ctx
   * @param {RainConfig} config
   */
  constructor(ctx: OffscreenCanvasRenderingContext2D, config: RainConfig) {
    this.ctx = ctx;
    this.applyConfig(config);
  }

  applyConfig(config: RainConfig) {
    this.rotationRad = degToRad(config.rotationDeg);

    this.durationRange = config.durationRange;
    this.widthRange = config.raindropWidthRange;
    this.lengthRange = config.raindropLengthRange;

    this.colors = config.availableColors;
  }

  /**
   * Creates raindrops.
   *
   * @param {number} count
   */
  init(count: number) {
    this.drops = Array.from({ length: count }, () => this.createDrop(true));
  }

  /**
   * Updates raindrop configuration.
   *
   * @param {number} count
   */
  updateRaindrops(count: number) {
    if (count != this.drops.length) {
      this.init(count);
    }
  }

  /** Starts the animation */
  start() {
    if (this.animationId !== null) return;

    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.loop);
  }

  /** Cancels the animation */
  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resize(width: number, height: number) {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }

  /**
   * Main animation loop
   *
   * @param {number} time
   */
  private loop = (time: number) => {
    let delta = time - this.lastTime;
    this.lastTime = time;

    if (delta > MAX_DELTA_TIME) {
      delta = MAX_DELTA_TIME;
    }

    this.updateAnimation(delta);
    this.draw();

    this.animationId = requestAnimationFrame(this.loop);
  };

  /**
   * Updates animation state based on delta time.
   *
   * @private
   * @param {number} delta
   */
  private updateAnimation(delta: number) {
    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i]!;

      d.y += d.speed * delta;
      d.x += d.xSpeed * delta;

      if (d.y > this.height + d.length) {
        this.drops[i] = this.createDrop(false);
      }
    }
  }


  private draw() {
    const { ctx, width, height, rotationRad } = this;

    ctx.clearRect(0, 0, width, height);

    // Precompute rotation matrix components once per frame
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    for (const d of this.drops) {
      // Directly set full transform matrix:
      // [ cos  sin  -sin  cos  tx  ty ]
      ctx.setTransform(cos, sin, -sin, cos, d.x, d.y);

      ctx.fillStyle = d.color;

      ctx.beginPath();
      ctx.roundRect(-d.width / 2, -d.length / 2, d.width, d.length, d.width / 2);
      ctx.fill();
    }

    // IMPORTANT:
    // Reset transform back to identity for safety
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }


  private createDrop(randomY: boolean): Raindrop {
    const duration = randomBetween(this.durationRange.min, this.durationRange.max);

    const speed = (this.height) / duration;
    const xSpeed = Math.tan(-this.rotationRad) * speed;

    const widthMultiplier = randomBetween(this.widthRange.min, this.widthRange.max);

    const lengthMultiplier = randomBetween(this.lengthRange.min, this.lengthRange.max);

    const width = Math.max(1, this.width * widthMultiplier);
    const length = this.height * lengthMultiplier;

    const minX = -Math.cos(this.rotationRad) * this.width * 0.5; // We lower the minX even further to ensure the entrie space is covered
    const x = randomBetween(minX, this.width);

    const y = randomY ? randomBetween(-this.height, this.height) : -length;

    return {
      x,
      y,
      speed,
      xSpeed,
      width,
      length,
      color: chooseRandomlyFrom(this.colors),
    };
  }
}

/**
 * Worker state for RainEngine
 *
 * @type {(RainEngine | null)}
 */
let engine: RainEngine | null = null;

self.addEventListener('message', (event: MessageEvent) => {
  const { type, data } = event.data;

  switch (type) {
    case 'init': {
      const config = data as RainConfig;

      if (!config.canvas) return;

      const ctx = config.canvas.getContext('2d');
      if (!ctx) return;

      const mergedConfig = {
        ...DEFAULT_WORKER_CONFIG,
        ...config,
      };

      engine = new RainEngine(ctx, mergedConfig);
      engine.init(mergedConfig.raindropCount);

      break;
    }

    case 'resize': {
      engine?.resize(data.width, data.height);
      break;
    }

    case 'update': {
      engine?.updateRaindrops(data.raindropCount);
      break;
    }

    case 'start': {
      engine?.start();
      break;
    }
    case 'stop': {
      engine?.stop();
      break;
    }
  }
});
