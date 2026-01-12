import { Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { ZardAvatarContainerComponent } from '@shared/components/avatar/avatar.component';

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
  imports: [ZardAvatarContainerComponent],
  template: `
    <z-avatar-container
      class="rounded-full min-w-3xl w-[25%] aspect-square m-auto *:-mb-[2.25%] overflow-hidden"
      zSize="none"
      zShape="circle"
      zFallback="SC"
      zType="secondary"
      [content]="video"
      tabindex="0"
    >
      <ng-template #video>
        <video playsinline muted autoplay #avatarVideo>
          <source type="video/quicktime; codecs=hvc1.1.6.H120.b0" [src] = "avatarSrc() + '.mp4'" />
          <source type="video/webm; codecs=vp09.00.41.08" [src] = "avatarSrc() + '.webm'" />
          <img [src]="avatarSrc() + '.png'" [alt]="this.posture()"/>
        </video>
      </ng-template>
    </z-avatar-container>
  `
})
export class LandingAboutMeAvatarComponent {
  readonly posture = input.required<Postures>();
  protected readonly video = viewChild.required<ElementRef>('avatarVideo')
  readonly avatarSrc = computed(() => {
    const src = `assets/avatars/me-${this.posture()}`
    const videoElement: HTMLVideoElement = this.video().nativeElement
    videoElement.load() // Dynamic binding in Angularv20 to <source>'s src tag fails: https://stackoverflow.com/questions/39180415/angular-2-change-videos-src-after-clicking-on-div#comment112049463_39237248
    videoElement.play()
    return src
  });
}
