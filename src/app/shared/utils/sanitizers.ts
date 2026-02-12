import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Source - https://stackoverflow.com/a/58269720
// Posted by Sahil Ralkar
// Retrieved 2026-02-08, License - CC BY-SA 4.0

/**
 * Marks the following url as 'safe'
 *
 * @export
 * @class SafeResourceUrlPipe
 * @typedef {SafeResourceUrlPipe}
 * @implements {PipeTransform}
 */
@Pipe({ name: 'sanitizeResourceUrl' })
export class SafeResourceUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
