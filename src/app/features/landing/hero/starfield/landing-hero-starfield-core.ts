/**
 * Core starfield logic shared between angular-three implementation and Web Worker.
 * Extracted from the original scene graph to ensure consistency.
 */
import { Color } from 'three/webgpu';

/**
 * Configuration interface for starfield parameters.
 */
export const DefaultStarfieldConfig = {
  stars: 100 as number,
  starSize: 0.001 as number,
  fieldRadius: 0.5 as number,
  starGlow: 80 as number,
  starFade: 0.1 as number,
  fieldSpinX: -1 / 1024,
  fieldSpinY: 1 / 512,
  fieldSpinZ: 1 / 256,
  starColors: ['white'] as string[],
  fieldEnterDuration: 2.85 as number,
  starEnterDuration: 2.5 as number,
} as const;

export type StarfieldConfig = typeof DefaultStarfieldConfig;

/**
 * This factor ensures there is actually roughly `stars` stars visually on screen.
 * Matches the original STAR_TO_COUNT_FACTOR from the graph implementation.
 */
export const STAR_TO_COUNT_FACTOR = 11;

/**
 * Calculates the actual point count from desired star count.
 */
export function calculatePointCount(stars: StarfieldConfig['stars']): number {
  return stars * STAR_TO_COUNT_FACTOR;
}

/**
 * Calculates reveal speed: how fast the reveal sphere expands (units per second).
 */
export function calculateRevealSpeed(
  fieldRadius: StarfieldConfig['fieldRadius'],
  fieldEnterDuration: StarfieldConfig['fieldEnterDuration']
): number {
  return fieldRadius / fieldEnterDuration;
}

/**
 * Calculates reveal width: the thickness of the reveal transition band.
 */
export function calculateRevealWidth(
  revealSpeed: StarfieldConfig['fieldRadius'],
  starEnterDuration: StarfieldConfig['starEnterDuration']
): number {
  return revealSpeed * starEnterDuration;
}


/**
 * Converts color strings to a ThreeJS color palette.
 */
export function generateColorPalette(
  colorStrings: StarfieldConfig['starColors']
): Color[] {

  const palette: Color[] = new Array(colorStrings.length);

  for (let i = 0; i < colorStrings.length; i++) {
    palette[i] = new Color(colorStrings[i]);
  }

  return palette;
}
