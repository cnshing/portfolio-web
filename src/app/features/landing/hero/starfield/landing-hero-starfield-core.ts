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
 * The number of stars visually seen on the 2D viewport is not exactly identical to the number of star instances in the 3D world. This function adjusts the number of instances required based off what is being perceived.
 * @param stars The requested number of stars
 * @param fieldRadius The radius of the sphere geometry point material
 * @param fov The FOV of the camera
 * @param aspect The width/height aspect ratio of the camera.
 * @param devicePixelRatio Window's devicePixelRatio.
 * @param cameraOffset The distance between the camera and the origin of the sphere geometry point material.
 * @returns
 */
export function calculatePointCount(
  stars: StarfieldConfig['stars'],
  fieldRadius: StarfieldConfig['fieldRadius'],
  fov: number,
  aspect: number,
  devicePixelRatio: number,
  cameraOffset: number
): number {

  // Manual adjustment of stars to ensure number of stars match what is being seen on the screen
  const STAR_TO_COUNT_FACTOR = 3
  const base = stars * STAR_TO_COUNT_FACTOR;

  // Adjust number of stars based off FOV, which does affect star spread.
  const fovRad = (fov * Math.PI) / 180;
  const tanY = Math.tan(fovRad / 2);
  const tanX = tanY * aspect;
  const angularFactor = tanX * tanY;

  // Adjust number of stars based off geometric shape of the underlying sphere
  const avgDepth = Math.max(0, fieldRadius - cameraOffset);
  const volumeFactor = fieldRadius * fieldRadius * avgDepth;

  // Adjust for device Pixel Ratio
  const dprFactor = Math.sqrt(devicePixelRatio);
  const count =
    base *
    angularFactor *
    volumeFactor *
    dprFactor;
  return Math.max(1, Math.round(count));
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
