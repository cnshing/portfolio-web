import type { ClassValue } from 'clsx';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { mergeClasses } from '@shared/utils/merge-classes';
import { blockquoteVariants, barVariants, ZardBlockQuoteBarVariants } from './blockquote.variants';

@Component({
  imports: [],
  selector: 'blockquote, blockquote[z-blockquote]',
  exportAs: 'zBlockquote',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="barClasses()"></span>
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBlockQuoteComponent {
  readonly zType = input<ZardBlockQuoteBarVariants['zType']>('default');
  readonly zShape = input<ZardBlockQuoteBarVariants['zShape']>('circle');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(blockquoteVariants(), this.class()));

  protected readonly barClasses = computed(() =>
    barVariants({
      zType: this.zType(),
      zShape: this.zShape(),
    })
  );
}
