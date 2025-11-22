import { Component, computed, input } from '@angular/core';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';

export const postures = ['presenting', 'rock-and-roll', 'thinking'] as const;
export type Postures = (typeof postures)[number];

@Component({
  selector: 'me-avatar',
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar
      class="rounded-full min-w-3xl w-[25%] aspect-square m-auto"
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

  readonly zSrc = computed(() => `assets/avatars/me-${this.posture()}.png`);
}
