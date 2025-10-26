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
    @if (zTitle()) {
    <div [class]="headerClasses()">
      <ng-container [ngTemplateOutlet]="zAvatar()"/>
        <div class="text-lg font-primary text-color-default leading-none tracking-tight">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>
      @if (zDescription()) {
        <div class="text-md font-secondary text-color-secondary">
          <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
        </div>
        }
      <ng-container [ngTemplateOutlet]="zLabel()"/>
    </div>
  }

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
  readonly zAvatar = input<TemplateRef<void>>()
  readonly zLabel = input<TemplateRef<void>>()

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
  protected readonly headerClasses = computed(() => mergeClasses(cardHeaderVariants()));
  protected readonly bodyClasses = computed(() => mergeClasses(cardBodyVariants()));
}
