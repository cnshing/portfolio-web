import { ChangeDetectionStrategy, Component, computed, input, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { avatarVariants, imageVariants, type ZardImageVariants, type ZardAvatarVariants } from './avatar.variants';
import { mergeClasses } from '@shared/utils/merge-classes';

export type ZardAvatarStatus = 'online' | 'offline' | 'doNotDisturb' | 'away' | 'invisible';

@Component({
  selector: 'z-avatar-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  host: {
    '[class]': 'containerClasses()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-status]': 'zStatus() ?? null',
  },
  template: `<ng-container [ngTemplateOutlet]="content()"></ng-container>`,
})
export class ZardAvatarContainerComponent {
  readonly zType = input<ZardAvatarVariants['zType']>('default');
  readonly zStatus = input<ZardAvatarStatus>();
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize']>('default');
  readonly class = input<string>('');
  readonly content = input.required<TemplateRef<any>>()

  protected readonly containerClasses = computed(() =>
    mergeClasses(
      avatarVariants({
        zType: this.zType(),
        zShape: this.zShape(),
        zSize: this.zSize(),
      }),
      this.class()
    )
  );
}

@Component({
  selector: 'z-avatar, [z-avatar]',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardAvatarContainerComponent],
  host: {
    style: 'display: contents',
    class: ''
  },
  template: `
    <z-avatar-container [zType]="zType()" [zStatus]="zStatus()" [zShape]="zShape()" [zSize]="zSize()" [content]="content" [class]="class()">
    <ng-template #content>
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span class="text-[length:inherit] absolute m-auto z-0">{{ zFallback() }}</span>
    }

    @if (zSrc() && !imageError()) {
      <img [src]="zSrc()" [alt]="zAlt()" [class]="imgClasses()" [hidden]="!imageLoaded()" (load)="onImageLoad()" (error)="onImageError()" />
    }

    @if (zStatus()) {
      @switch (zStatus()) {
        @case ('online') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--bg-color-surface2)"
            stroke-width="var(--border-width-default)"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-green-200 w-5 h-5 z-20 scale-70"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
        @case ('offline') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--bg-color-surface2)"
            stroke-width="var(--border-width-default)"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-20 scale-70"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
        @case ('doNotDisturb') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--bg-color-surface2)"
            stroke-width="var(--border-width-default)"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-20 scale-70"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" fill="currentColor" />
          </svg>
        }
        @case ('away') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--bg-color-surface2)"
            stroke-width="var(--border-width-default)"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-yellow-300 rotate-y-180 w-5 h-5 z-20 scale-70"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" />
          </svg>
        }
        @case ('invisible') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--border-color-default)"
            stroke-width="var(--border-width-default)"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-bg-surface2/50 w-5 h-5 z-20 scale-70"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
      }
    }
    </ng-template>
  </z-avatar-container>
  `
})
export class ZardAvatarComponent {
  readonly zType = input<ZardAvatarVariants['zType']>('default');
  readonly zStatus = input<ZardAvatarStatus>();
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize']>('default');
  readonly zSrc = input<string>();
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');

  readonly class = input<string>('');

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

  protected readonly imgClasses = computed(() => mergeClasses(imageVariants({ zShape: this.zShape() })));

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  protected onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
