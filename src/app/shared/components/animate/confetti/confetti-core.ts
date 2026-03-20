/**
 * Core confetti logic shared between angular implementation and Web Worker.
 * Extracted to keep configuration, derived calculations, and palette creation consistent.
 */
import { Color } from 'three/webgpu';

/**
 * Configuration interface for confetti parameters.
 */
export const DefaultConfettiConfig = {
  isExploding: true as boolean,
  amount: 100 as number,
  rate: 3 as number,
  radius: 15 as number,
  areaWidth: 3 as number,
  areaHeight: 1 as number,
  fallingHeight: 10 as number,
  fallingSpeed: 8 as number,
  colors: ['#0000ff', '#ff0000', '#ffff00'] as string[],
  pieceSize: 0.03 as number,
  pieceSpin: 1 as number,
  opacityFade: 1 as number,
} as const;

export type ConfettiConfig = typeof DefaultConfettiConfig;

/**
 * Optional factor for visual density tuning.
 * Kept explicit so the worker can derive actual instance count from a semantic "amount".
 */
export const CONFETTI_TO_COUNT_FACTOR = 1;

/**
 * Calculates the actual particle count from the semantic amount value.
 */
export function calculateParticleCount(
  amount: ConfettiConfig['amount']
): number {
  return Math.max(0, Math.floor(amount * CONFETTI_TO_COUNT_FACTOR));
}



export function calculateSpawnRate(
  rate: ConfettiConfig['rate']
): number {
  // In the old CPU system, rate was "chance of spawning a burst per frame".
  // In the GPU system, this is better interpreted as lifecycle frequency.
  // So dividing by 100 makes the animation extremely slow.
  return Math.max(0.25, rate);
}

/**
 * Calculates a simple gravity scalar from the original falling speed input.
 * Higher fallingSpeed means particles descend faster.
 */
export function calculateGravity(
  fallingSpeed: ConfettiConfig['fallingSpeed']
): number {
  // Slightly stronger drop so the arc reads more clearly.
  return Math.max(0.25, fallingSpeed * 0.35);
}


/**
 * Converts color strings to a ThreeJS color palette.
 */
export function generateColorPalette(
  colorStrings: ConfettiConfig['colors']
): Color[] {
  const palette: Color[] = new Array(colorStrings.length);

  for (let i = 0; i < colorStrings.length; i++) {
    palette[i] = new Color(colorStrings[i]);
  }

  return palette;
}