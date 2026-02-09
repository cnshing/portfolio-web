import { Directive, inject, input, computed } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Transparent videos currently require two seperate video assets for webkit and non webkit engines respectively. This component dynamically selects the correct video asset for prefetching/preloading purposes.
 *
 * @export
 * @class TransparentVideoLinkComponent
 * @typedef {TransparentVideoLinkComponent}
 */
@Directive({
  selector: 'link[selectTransparent]',
  standalone: true,
  host: {
    '[href]': 'sanitizedHref()',
  },
})
export class TransparentVideoLinkComponent {
  /**
   * Transparent video asset for the webkit engine.
   *
   * @readonly
   * @type {*}
   */
  readonly zWebkitSrc = input.required<string>();
  /**
   * Fallback video asset for non-webkit engines.
   *
   * @readonly
   * @type {*}
   */
  readonly zFallbackSrc = input.required<string>();


  private readonly platform = inject(Platform);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Binded [href]'s for link components must be sanitized
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly sanitizedHref = computed(() => {
    const src = this.platform.WEBKIT ? this.zWebkitSrc() : this.zFallbackSrc();
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  });
}
