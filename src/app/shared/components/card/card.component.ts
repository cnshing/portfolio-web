import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@shared/utils/merge-classes';
import { ZardStringTemplateOutletDirective } from '@shared/components/core/directives/string-template-outlet/string-template-outlet.directive';
import { NgTemplateOutlet } from '@angular/common';
import { cardBodyVariants, cardHeaderVariants, cardVariants } from './card.variants';

@Component({
  selector: 'z-card',
  exportAs: 'zCard',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="headerClasses()">
      <ng-container [ngTemplateOutlet]="zAvatarOrIcon()"/>
      @if (zTitle()) {
      <div class="mr-auto flex flex-col gap-2xs">
        <div class="text-xl font-primary text-color-default tracking-tight">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>
        @if (zDescription()) {
        <div class="text-lg font-secondary text-color-secondary">
          <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
        </div>
        }
      </div>
      }
      <ng-container [ngTemplateOutlet]="zLabel()"/>
      </div>


    <div [class]="bodyClasses()">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardComponent {
  readonly zTitle = input<string | TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>();
  readonly zAvatarOrIcon = input<TemplateRef<void>>()
  readonly zLabel = input<TemplateRef<void>>()

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
  protected readonly headerClasses = computed(() => mergeClasses(cardHeaderVariants()));
  protected readonly bodyClasses = computed(() => mergeClasses(cardBodyVariants()));
}
