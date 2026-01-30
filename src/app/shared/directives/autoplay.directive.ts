import { afterNextRender, DestroyRef, Directive, ElementRef, inject, signal } from "@angular/core";

/**
 * Guranatees video will autoplay on any specified autoplay video. From https://stackoverflow.com/a/65290856 and https://stackoverflow.com/a/55940696.
 *
 * This workaround forces the video to be muted.
 *
 * @export
 * @class VideoAutoplayDirective
 * @typedef {VideoAutoplayDirective}
 */
@Directive({
  selector: 'video[autoplay]',
  host: {
    autoplay: '',
    oncanplay: 'this.play()',
    '[muted]': '"muted"',
    onloadedmetadata: 'this.muted = true',
  },
})
export class VideoAutoplayDirective {}

/**
 *
 * Autoplays video only when the element is visible. An alternative directive to force `autoplay` playback.
 *
 * @export
 * @class AutoplayOnVisibleDirective
 * @typedef {AutoplayOnVisibleDirective}
 */
@Directive({
  selector: 'video[autoplayOnVisible]',
  standalone: true,
  host: {
    '[attr.muted]': 'this.isVisible() ? "" : undefined',
    '[attr.autoplay]': 'this.isVisible() ? "" : undefined',
  },
})
export class AutoplayOnVisibleDirective {

  private el = inject(ElementRef<HTMLVideoElement>);
  private destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;


  /**
   * Is the video element visible?
   *
   * @readonly
   * @type {boolean}
   */
  readonly isVisible = signal<boolean>(false);

  constructor() {
    afterNextRender(() => this.initObserver());
  }

  /**
   * Configures autoplay when video element is observed
   *
   * @private
   */
  private initObserver(): void {
    const video = this.el.nativeElement;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          this.isVisible.set(true);
          video.play();
          this.observer?.disconnect();
        }
      },
      { threshold: 1 }
    );

    this.observer.observe(video);

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }
}
