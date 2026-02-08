import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

/**
 * Hard coded value depicting available image assets with the following pixel densities.
 *
 * @type {number[]}
 */
const AVAILABLE_DENSITIES = [0.125, 0.25, 0.5, 0.75, 1.0];


/**
 * Given a 'baseWidth' in loaderParams, configures 1-to-1 pixel density srcsets for `ngSrcset`.
 *
 * @export
 * @param {ImageLoaderConfig} config
 * @returns {string} String path of pixel density `density` equivalent to `src`.
 */
export function pixelDensityImageLoader(
  config: ImageLoaderConfig
): string {
  const { src, width, loaderParams } = config

  // Safety fallback
  if (!width || !(loaderParams && 'baseWidth' in loaderParams)) {
    return withDensity(src, 1);
  }

  const baseWidth = loaderParams['baseWidth']
  const bestDensity = findBestDensityByWidth(width, baseWidth);

  return withDensity(src, bestDensity);
}

/**
 * Finds the density whose resulting image width
 * (baseWidth * density) is closest to the requested width.
 */
function findBestDensityByWidth(
  requestedWidth: number,
  baseWidth: number
): number {
  return AVAILABLE_DENSITIES.reduce((best, density) => {
    const bestWidth = baseWidth * best;
    const currentWidth = baseWidth * density;

    return Math.abs(currentWidth - requestedWidth) <
      Math.abs(bestWidth - requestedWidth)
      ? density
      : best;
  });
}


/**
 *
 *
 * @param {string} src String file path.
 * @param {number} density Pixel density.
 * @returns {string} String path of pixel density `density` equivalent to `src`.
 */
function withDensity(src: string, density: number): string {
  const pathWithoutExt = src.replace(/\.\w+$/, '');
  return `${pathWithoutExt}@${density}x.avif`;
}

export const IMAGE_LOADER_PROVIDER = {
  provide: IMAGE_LOADER,
  useValue: pixelDensityImageLoader,
};
