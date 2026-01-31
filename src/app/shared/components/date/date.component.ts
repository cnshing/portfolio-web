import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { dateVariants, ZardDateVariants } from './date.variants';
import type { ClassValue } from '@shared/utils/merge-classes';
import { mergeClasses } from '@shared/utils/merge-classes';

export type { ZardDateVariants };

@Component({
  selector: 'z-date, [z-date]',
  exportAs: 'zDate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  template: `
      <time [dateTime]="value().toISOString()" [class]="classes()">{{ displayText() }}</time>
  `,
  providers: [DatePipe],
})
export class ZardDateComponent {
  private readonly datePipe = inject(DatePipe);
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardDateVariants['zSize']>('default');
  readonly value = input.required<Date>();
  readonly zFormat = input<string>('MMMM dd, yyyy');

  protected readonly classes = computed(() =>
    mergeClasses(
      dateVariants({
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  protected readonly displayText = computed(() => {
    const date = this.value()
    return this.formatDate(date, this.zFormat())
  });

  private formatDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format) || '';
  }
}
