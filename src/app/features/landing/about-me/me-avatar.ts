import { Component, computed, ElementRef, inject, input, viewChild } from '@angular/core';
import { ZardAvatarContainerComponent } from '@shared/components/avatar/avatar.component';
import { AutoplayOnVisibleDirective, VideoAutoplayDirective } from '@shared/directives/autoplay.directive';
import { SafeResourceUrlPipe } from '@shared/utils/sanitizers';
import { Platform, PlatformModule } from '@angular/cdk/platform';

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

@Component({
  selector: 'me-avatar',
  standalone: true,
  imports: [ZardAvatarContainerComponent, VideoAutoplayDirective, AutoplayOnVisibleDirective, SafeResourceUrlPipe, PlatformModule],
  template: `
    @for (avatar of postures; track avatar) {
      @if (isWebkit) {
        <link rel="prefetch" [href]="avatarSrcPath(avatar) + '.mp4' | sanitizeResourceUrl"/>
      }
      @else {
        <link rel="prefetch" [href]="avatarSrcPath(avatar) + '.webm' | sanitizeResourceUrl" />
      }
    }
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
        <video disableRemotePlayback  playsinline autoplay autoplayOnVisible [poster]="avatarSrc()+'@0.5x.avif'" #avatarVideo>
          <source type="video/quicktime; codecs=hvc1.1.6.H120.b0" [src] = "avatarSrc() + '.mp4'" />
          <source type="video/webm; codecs=vp09.00.41.08" [src] = "avatarSrc() + '.webm'" />
        </video>
      </ng-template>
    </z-avatar-container>
  `
})
export class LandingAboutMeAvatarComponent {
  readonly posture = input.required<Postures>();
  protected readonly video = viewChild.required<ElementRef>('avatarVideo')
  readonly avatarSrc = computed(() => {
    const src = this.avatarSrcPath(this.posture())
    const videoElement: HTMLVideoElement = this.video().nativeElement
    videoElement.load() // Dynamic binding in Angularv20 to <source>'s src tag fails: https://stackoverflow.com/questions/39180415/angular-2-change-videos-src-after-clicking-on-div#comment112049463_39237248
    videoElement.playbackRate = 0.91
    return src
  });


  /**
   *
   *
   * @param {Postures} posture
   * @returns {string} Avatar source path of `posture`
   */
  protected readonly avatarSrcPath = (posture: Postures) => `/assets/avatars/me-${posture}`

  protected readonly postures = postures

  protected readonly isWebkit = inject(Platform).WEBKIT
}
