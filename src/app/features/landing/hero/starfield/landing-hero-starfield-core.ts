/**
 * Core starfield logic shared between angular-three implementation and Web Worker.
 * Extracted from the original scene graph to ensure consistency.
 */
import { random } from 'maath';
import { Color } from 'three';

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
 * Generates random star positions within a sphere.
 */
export function generateStarPositions(
  count: StarfieldConfig['stars'],
  radius: StarfieldConfig['fieldRadius']
): Float32Array {
  return random.inSphere(new Float32Array(count * 3), { radius }) as Float32Array;
}

/**
 * Converts color strings to a Float32Array palette.
 */
export function generateColorPalette(
  colorStrings: StarfieldConfig['starColors']
): Float32Array {
  const palette = new Float32Array(colorStrings.length * 3);

  for (let i = 0; i < colorStrings.length; i++) {
    const c = new Color(colorStrings[i]);
    const idx = i * 3;

    palette[idx] = c.r;
    palette[idx + 1] = c.g;
    palette[idx + 2] = c.b;
  }

  return palette;
}

/**
 * Assigns random colors from palette to each star.
 * Matches the original color assignment logic from the graph component.
 */
export function generateStarColors(
  count: StarfieldConfig['stars'],
  palette: Float32Array
): Float32Array {
  const paletteCount = palette.length / 3;
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const p = ((Math.random() * paletteCount) | 0) * 3;
    const idx = i * 3;

    colors[idx] = palette[p]!;
    colors[idx + 1] = palette[p + 1]!;
    colors[idx + 2] = palette[p + 2]!;
  }

  return colors;
}

/**
 * Creates shader uniforms for the starfield.
 */
export function createStarfieldUniforms(
  fieldRadius: StarfieldConfig['fieldRadius'],
  fieldEnterDuration: StarfieldConfig['fieldEnterDuration'],
  starEnterDuration: StarfieldConfig['starEnterDuration'],
  starFade: StarfieldConfig['starFade'],
  starGlow: StarfieldConfig['starGlow']
) {
  const revealSpeed = calculateRevealSpeed(fieldRadius, fieldEnterDuration);
  const revealWidth = calculateRevealWidth(revealSpeed, starEnterDuration);

  return {
    time: { value: 0 },
    revealSpeed: { value: revealSpeed },
    revealWidth: { value: revealWidth },
    fadeBias: { value: starFade },
    glowStrength: { value: starGlow },
  };
}