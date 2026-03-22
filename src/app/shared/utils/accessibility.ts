import { Pipe, PipeTransform } from '@angular/core';

/**
 * Derive a human-readable alt string from a source path.
 *
 * The pipe extracts the filename from a path, removes the file extension,
 * normalizes common separators (hyphens, underscores, dots), and formats the
 * result for accessibility-friendly display.
 *
 * @export
 * @class AltFromSrcPipe
 * @implements {PipeTransform}
 *
 * @example
 * // In template:
 * {{ "path/to/logo.png" | altFromSrc }}
 * // "Logo"
 *
 * @example
 * {{ "my-awesome_logo.png" | altFromSrc }}
 * // "My Awesome Logo"
 *
 * @example
 * {{ "path/to/my.company.logo.svg" | altFromSrc }}
 * // "My Company Logo"
 *
 * @example
 * {{ "path/to/logo" | altFromSrc }}
 * // "Logo"
 *
 * @example
 * {{ undefined | altFromSrc }}
 * // ""
 */
@Pipe({
  name: 'altFromSrc',
  standalone: true,
})
export class AltFromSrcPipe implements PipeTransform {
  /**
   * Transform a source path into a human-readable alt string.
   *
   * @param {?string} [src] A string path similar to "path/to/file.ext"
   * @returns {string} Human-readable alt string.
   */
  transform(src?: string): string {
    if (!src) return "";

    const start = src.lastIndexOf("/") + 1;
    const end = src.lastIndexOf(".");

    const filename =
      end > start
        ? src.substring(start, end)
        : src.substring(start);

    return filename
      .replace(/[-_.]+/g, " ")
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}

/**
 * Does the device primarly use a touch screen?
 *
 * @returns {bool}
 */
export const isTouchDevice = () => matchMedia('(pointer:coarse)').matches // https://stackoverflow.com/a/14457567

/**
 * Does the user prefer to reduce or have no animations?
 *
 * @returns {bool}
 */
export const isReduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Is the device running Chrome on iOS?
 * @returns {bool}
 */
export const isCriOS = () => navigator.userAgent.match('CriOS')