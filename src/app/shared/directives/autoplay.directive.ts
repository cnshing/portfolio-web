import { Directive } from "@angular/core";

/**
 * Guranatees video will autoplay on any specified autoplay video. From https://stackoverflow.com/a/65290856 and https://stackoverflow.com/a/55940696
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