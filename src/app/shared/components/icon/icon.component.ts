import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';
import { NgIcon, provideIcons } from '@ng-icons/core'
import { iconVariants, ZardIconVariants } from './icon.variants';
import { mergeClasses } from '@shared/utils/merge-classes';
import { ZARD_ICONS, ZardIcon } from './icons';

@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons(ZARD_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-icon [name]="zType()" [strokeWidth]="zStrokeWidth()" />`,
  host: {
    '[class]': 'classes()',
  }
})
export class ZardIconComponent {
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zColor = input<ZardIconVariants['zColor']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize(), zColor: this.zColor()}), this.class()));

  protected readonly icon = computed(() => {
    const type = this.zType();
    if (typeof type === 'string') {
      return ZARD_ICONS[type as keyof typeof ZARD_ICONS];
    }
    return type;
  });
}
