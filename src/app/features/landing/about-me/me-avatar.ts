import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, ElementRef, input, signal, untracked, viewChild } from '@angular/core';
import { ZardAvatarContainerComponent } from '@shared/components/avatar/avatar.component';
import { VideoAutoplayDirective } from '@shared/directives/autoplay.directive';
import { AltFromSrcPipe } from '@shared/utils/accessibility';
import { SafeResourceUrlPipe } from '@shared/utils/sanitizers';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';

/**
 * All available postures to preview
 *
 * @type {readonly ["concentrating", "hands-up", "laughing", "presenting", "thumbs-up", "knocking", "okay", "pulling", "thinking", "waddling"]}
 */
export const postures = [
  'concentrating',
  'hands-up',
  'laughing',
  'presenting',
  'thumbs-up',
  'knocking',
  'okay',
  'pulling',
  'thinking',
  'waddling',
] as const;
export type Postures = (typeof postures)[number];

/**
 * Retrieve the avatar src from the base posture.
 *
 * @param {Postures} posture
 * @returns {string} Avatar source path of `posture`
 */
export const avatarSrcPath = (posture: Postures) => `/assets/avatars/me-${posture}`

/**
 * An interactive video element playing various avatar assets.
 *
 * @export
 * @class LandingAboutMeAvatarComponent
 * @typedef {LandingAboutMeAvatarComponent}
 */
@Component({
  selector: 'me-avatar',
  standalone: true,
  imports: [ZardAvatarContainerComponent, VideoAutoplayDirective, NgOptimizedImage, AltFromSrcPipe, SafeResourceUrlPipe, ZardLoaderComponent],
  template: `
    <z-avatar-container
      class="rounded-full aspect-square overflow-hidden"
      zSize="none"
      zShape="circle"
      zFallback="SC"
      zType="secondary"
      zAlt="Avatar"
      [content]="videoTemplate"
    >
      <ng-template #videoTemplate>
        <div class="relative size-full">
        <img class="absolute size-full" [ngSrc]="posterSrc() | sanitizeResourceUrl"
        (load)="this.onPosterReady()"
        [loaderParams]="{baseWidth: 1080, stepDownOffset: 1}"
          width="1080"
          height="1080"
          sizes="auto"
          loading="auto"
          decoding="async"
          [alt]="posterSrc() | altFromSrc "
          [class.hidden]="!this.showPoster()"
          >
        @if (this.showLoader()) {
        <z-loader class="absolute top-1/2 left-1/2 -translate-1/2 size-[37.5%] z-[2]" zSize="full" />
        }
        <video disableRemotePlayback  playsinline autoplay class="absolute size-full" (canplaythrough)="this.onVideoReady()" #avatarVideo
        [class.hidden]="!this.showVideo()">
          <source type="video/quicktime; codecs=hvc1.1.6.H120.b0" [src] = "avatarSrc() + '.mp4'" />
          <source type="video/webm; codecs=vp09.00.41.08" [src] = "avatarSrc() + '.webm'" />
        </video>
      </div>
      </ng-template>
    </z-avatar-container>
  `
})
export class LandingAboutMeAvatarComponent {
  /**
   * Avatar posture to play.
   *
   * @readonly
   * @type {*}
   */
  readonly posture = input.required<Postures>();
  /**
   * Should the video element be rendered?
   *
   * @readonly
   * @type {*}
   */
  readonly showVideo = signal<boolean>(false)
  /**
   * Show the poster element be rendered?
   *
   * @readonly
   * @type {*}
   */
  readonly showPoster = signal<boolean>(false)
  /**
   * Should the loader element be rendered?
   *
   * @readonly
   * @type {*}
   */
  readonly showLoader = signal<boolean>(false)
  /**
   * Is the video element currently loading a new avatar?
   *
   * @readonly
   * @type {*}
   */
  readonly videoLoading = signal<boolean>(false)

  protected readonly video = viewChild.
  required<ElementRef<HTMLVideoElement>>('avatarVideo')

  /** Update UI state to reflect video readiness*/
  protected readonly onVideoReady = () => {
    this.showPoster.set(false)
    this.showLoader.set(false)
    this.showVideo.set(true)
    this.videoLoading.set(false)
  }
  /**
   * Current image source string of the posture.
   *
   * @readonly
   * @type {*}
   */
  readonly avatarSrc = computed(() =>
    this.avatarSrcPath(this.posture())
  );

  /** Prepares transition to loading the avatar video */
  protected readonly onPosterReady = () => {
    this.showPoster.set(true)
    this.showVideo.set(false)
    const mainVideo = this.video().nativeElement
    mainVideo.load() // Dynamic binding in Angularv20 to <source>'s src tag fails: https://stackoverflow.com/questions/39180415/angular-2-change-videos-src-after-clicking-on-div#comment112049463_39237248
    this.videoLoading.set(false)
    mainVideo.playbackRate = 0.91;
  }

  /**
   * Displays the loader if the loading took too long by `elapsed` seconds.
   *
   * @param {number} elapsed Time in milliseconds
   */
  protected showLoaderBy = (elapsed: number) => {
    setTimeout(() => {
      const loaderNeeded = untracked(() => this.videoLoading())
      if (loaderNeeded) {
        this.showLoader.set(true)}
    }, elapsed)
  }

  /**
   * Creates an instance of LandingAboutMeAvatarComponent.
   *
   * @constructor
   */
  constructor() {
    effect(() => {
      this.avatarSrc();
      this.showPoster.set(false);
      this.showLoader.set(false);
      this.showVideo.set(true);
      this.videoLoading.set(true)
      this.showLoaderBy(250)
    });
  }


  protected readonly postures = postures
  protected readonly avatarSrcPath = avatarSrcPath

  /**
   * Poster image source.
   *
   * @readonly
   * @type {*}
   */
  readonly posterSrc = computed(() =>
    this.avatarSrc() + '.png'
  )
}
