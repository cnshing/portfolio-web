import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '@shared/utils/merge-classes';
import { buttonVariants, ZardButtonVariants } from './button.variants';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component'

@Component({
  imports: [ZardLoaderComponent],
  selector: 'z-button, button[z-button], a[z-button]',
  exportAs: 'zButton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoading()) {
      <z-loader [zSize]="zSize()"/>
    }

    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardButtonComponent {
  readonly zType = input<ZardButtonVariants['zType']>('default');
  readonly zSize = input<ZardButtonVariants['zSize']>('default');
  readonly zShape = input<ZardButtonVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  readonly zFull = input(false, { transform });
  readonly zLoading = input(false, { transform });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zFull: this.zFull(),
        zLoading: this.zLoading(),
      }),
      this.class(),
    ),
  );
}
