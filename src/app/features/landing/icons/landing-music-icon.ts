import { Component, input } from '@angular/core';
import { ZardIconComponent } from '@shared/components/icon/icon.component';


/**
 * Music icon as a animated spinning vinyl.
 *
 * @export
 * @class LandingMusicIconComponent
 * @typedef {LandingMusicIconComponent}
 */
@Component({
  selector: 'landing-music-icon',
  exportAs: 'landingMusicIcon',
  imports: [ZardIconComponent],
  standalone: true,
  template:`
      <i
      z-icon
      zType="vinylRecord"
      [class.opacity-0]="paused()"
      [class.animation-paused]="paused()"
    ></i>
    <i
      z-icon
      zType="vinylRecordSlash"
      [class.opacity-0]="!paused()"
      [class.animation-paused]="paused()"
    ></i>
  `,
  styles: `
  .animation-paused // FROM https://stackoverflow.com/questions/5804444/how-to-pause-and-resume-css3-animation-using-javascript
    -webkit-animation-play-state: paused
    -moz-animation-play-state: paused
    -o-animation-play-state: paused
    animation-play-state: paused
  `,
  host: {
    'class': 'relative size-full *:absolute @container *:text-[100cqw] *:animate-spin *:[animation-duration:20000ms]'
  }
})
export class LandingMusicIconComponent {


  /**
   * Is the vinyl paused?
   *
   * @readonly
   * @type {*}
   */
  readonly paused = input<boolean>(false)

}
