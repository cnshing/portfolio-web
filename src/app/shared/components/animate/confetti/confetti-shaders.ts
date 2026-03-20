import {
  clamp,
  float,
  hash,
  mix,
  oneMinus,
  rotate,
  sin,
  cos,
  smoothstep,
  time,
  uv,
  vec2,
  vec3,
  abs,
  max,
  step,
  int,
  floor,
} from 'three/tsl';

import type { IndexNode, Node, UniformArrayNode, UniformNode } from 'three/webgpu';

/**
 * Helpers
 */

function saturate(x: Node<'float'>) {
  return clamp(x, 0.0, 1.0);
}

function remap01(x: Node<'float'>, a: Node<'float'>, b: Node<'float'>) {
  return saturate(x.sub(a).div(b.sub(a)));
}

function rand1(seed: Node<'float'>) {
  return hash(seed);
}

/**
 * Normalized life [0,1]
 */
export function createConfettiAgeNode(spawnTime: Node<'float'>, life: Node<'float'>) {
  return remap01(time.sub(spawnTime), float(0.0), life);
}

/**
 * POSITION NODE
 *
 * This version is closer to the original React confetti:
 * - shared origin per boom
 * - per-particle destination
 * - destination.y keeps drifting downward over time
 * - particle eases outward quickly, then keeps falling
 */
export function createConfettiPositionNode(
  localPosition: Node<'vec3'>,
  origin: Node<'vec3'>,
  destination: Node<'vec3'>,
  spawnTime: Node<'float'>,
  life: Node<'float'>,
  size: Node<'float'>,
  fallingSpeed: UniformNode<'float', number>,
  gravityMin: UniformNode<'float', number>,
  gravityMax: UniformNode<'float', number>,
  explodeDuration: UniformNode<'float', number>,
  index: IndexNode | Node<'float'>
) {
  const age = time.sub(spawnTime);
  const tLife = createConfettiAgeNode(spawnTime, life);
  const seed = float(index);

  /**
   * Match the original JS more closely:
   * destination.y -= rand(0.1, 0.3) every frame
   *
   * Approximated here as a continuous downward drift over time.
   */
  const destinationDropSpeed = mix(6.0, 18.0, rand1(seed.add(81.3)));
  const jitter = sin(age.mul(12.0).add(seed.mul(9.7))).mul(fallingSpeed.mul(0.1));

const movingDestination = vec3(
  destination.x,
  destination.y.sub(destinationDropSpeed.mul(age)).add(jitter),
  destination.z
);


  /**
   * Original JS does exponential-ish movement:
   * pos += (destination - pos) / 200
   *
   * This is approximated with a fast early burst, then continuing motion.
   */
  const burstEase = smoothstep(0.0, 1.0, saturate(age.div(explodeDuration)));
  const followEase = smoothstep(0.0, 1.0, saturate(age.div(life.mul(0.55))));
  const travel = mix(burstEase, followEase, 0.5);

  /**
   * Small side-to-side flutter to preserve the lively feel.
   */
  const flutter = vec3(
    sin(age.mul(8.3).add(seed.mul(1.37))).mul(0.08),
    0.0,
    cos(age.mul(6.7).add(seed.mul(2.11))).mul(0.08)
  ).mul(oneMinus(tLife.mul(0.35)));

  /**
   * Very light extra gravity variation so particles don't look too uniform.
   */
  const g = mix(gravityMin, gravityMax, rand1(seed.add(3.1)));
  const extraDrop = vec3(0.0, age.mul(g.mul(0.25)).negate(), 0.0);

  const scaledLocal = localPosition.mul(size);

  return origin
    .add(movingDestination.mul(travel))
    .add(flutter)
    .add(extraDrop)
    .add(scaledLocal);
}

/**
 * ROTATION NODE
 */
export function createConfettiRotationNode(
  localPosition: Node<'vec3'>,
  euler0: Node<'vec3'>,
  spin: Node<'vec3'>,
  spawnTime: Node<'float'>
) {
  const age = time.sub(spawnTime);
  const euler = euler0.add(spin.mul(age));

  return rotate(localPosition, euler);
}

/**
 * OPACITY NODE
 */
export function createConfettiOpacityNode(
  spawnTime: Node<'float'>,
  life: Node<'float'>,
  rotatedNormal: Node<'vec3'>
) {
  const t = createConfettiAgeNode(spawnTime, life);

  const baseFade = oneMinus(smoothstep(0.0, 1.0, t));
  const tumble = abs(rotatedNormal.z).mul(0.25).add(0.75);

  return saturate(baseFade.mul(tumble));
}

/**
 * CONFETTI SHAPE
 */
export function createConfettiFragmentShapeNode() {
  const p = uv().mul(2.0).sub(1.0);
  const q = vec2(abs(p.x), abs(p.y));

  const rect = max(q.x.sub(0.86), q.y.sub(0.54));
  const rounded = oneMinus(smoothstep(0.0, 0.08, rect));

  const cornerCutA = step(1.12, q.x.add(q.y));
  const cornerCutB = step(1.08, abs(p.x.mul(0.85).sub(p.y.mul(1.15))));

  const cornerMask = oneMinus(cornerCutA.mul(cornerCutB).mul(0.5));

  return saturate(rounded.mul(cornerMask));
}

/**
 * Randomly selects a color from palette.
 */
export function randomPaletteColorTSL(
  index: IndexNode | Node<'float'>,
  palette: UniformArrayNode<'color'>
) {
  const r = hash(float(index).add(1.0));
  const paletteIndex = int(floor(r.mul(int(palette.array.length))));
  return palette.element(paletteIndex).rgb;
}