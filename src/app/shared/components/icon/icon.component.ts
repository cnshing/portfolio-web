import { ChangeDetectionStrategy, Component, computed, input, viewChild, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';
import { NgIcon, provideIcons } from '@ng-icons/core'
import { iconVariants, ZardIconVariants } from './icon.variants';
import { mergeClasses } from '@shared/utils/merge-classes';
import { RAW_ZARD_ICONS, ZardIcon } from './icons';
import { dynamicIconLoader } from './icons';
import { provideNgIconLoader } from '@ng-icons/core';
@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons(RAW_ZARD_ICONS), provideNgIconLoader(dynamicIconLoader)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-icon [name]="zType()" [strokeWidth]="zStrokeWidth()" />`,
  host: {
    '[class]': 'classes()',
  }
})
export class ZardIconComponent {

  iconTemplate = viewChild.required(NgIcon)
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zColor = input<ZardIconVariants['zColor']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize(), zColor: this.zColor()}), this.class()));

  protected readonly icon = computed(() => this.iconTemplate().svg());
}
