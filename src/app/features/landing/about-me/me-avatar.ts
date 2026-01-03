import { Component, computed, input } from '@angular/core';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';

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
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar
      class="rounded-full min-w-3xl w-[25%] aspect-square m-auto *:-mb-[2.25%] overflow-hidden"
      zSize="none"
      zShape="circle"
      [zSrc]="this.zSrc()"
      zFallback="SC"
      zType="secondary"
    />
  `,
  styles: `
  :host ::ng-deep img // Pixel adjustment to correct asset offset
    padding-left: var(--spacing-2xs)
  `,
})
export class LandingAboutMeAvatarComponent {
  readonly posture = input.required<Postures>();

  readonly zSrc = computed(() => `assets/avatars/me-${this.posture()}.gif`);
}
